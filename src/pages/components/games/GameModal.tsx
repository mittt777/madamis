import { zodResolver } from "@hookform/resolvers/zod";
import {
  Badge,
  Button,
  Chip,
  Fieldset,
  Group,
  Modal,
  NativeSelect,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { hc } from "hono/client";
import { type FC, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { AppType } from "../../../api";
import {
  gmRequired,
  gmRequiredBadgeColor,
  gmRole,
} from "../../../constants/gmRequired";
import { useMadamisList } from "../../hooks/useMadamisList";
import { useUser } from "../../hooks/useUser";
import { useGameModalStore } from "../../stores/gameModalStore";
import { DeleteGameButton } from "./DeleteGameModal";

const client = hc<AppType>("/api");

export const GameModal = () => {
  const { data: madamisList } = useMadamisList();

  const { open, close, gameId } = useGameModalStore();

  const editData = useMemo(
    () =>
      gameId
        ? madamisList
            ?.find((m) => m.games.find((g) => g.id === gameId))
            ?.games.find((g) => g.id === gameId)
        : undefined,
    [gameId, madamisList],
  );

  return (
    <Modal
      opened={open}
      onClose={() => {
        close();
      }}
      title={`試合を${editData ? "編集" : "追加"}`}
      centered
      closeOnClickOutside={false}
      size="lg"
    >
      <GameForm editData={editData} />
    </Modal>
  );
};

const GameForm: FC<{
  editData?: {
    id: number;
    madamisId: number;
    date: string;
    gameUsers: ReadonlyArray<{
      gm: number;
      gameId: number;
      userId: number;
      user: {
        id: number;
        name: string;
        color: string;
      };
    }>;
  };
}> = ({ editData }) => {
  const { data: users } = useUser();
  const { data: madamisList, mutate } = useMadamisList();

  const { open, close, gameId, madamisId } = useGameModalStore();
  const [loading, setLoading] = useState(false);

  const madamis = useMemo(
    () => madamisList?.find((m) => m.id === madamisId),
    [madamisList, madamisId],
  );
  const userIds = useMemo(
    () => (users ? users.map((u) => u.id.toString()) : []),
    [users],
  );

  const defaultPlayers = useMemo(
    () =>
      editData?.gameUsers
        .filter((u) => {
          if (madamis?.gmRequired !== 1) {
            if (madamis?.player === editData.gameUsers.length) {
              return true;
            }
            return !u.gm;
          }
          return !u.gm;
        })
        .map((u) => u.user.id.toString()) ?? [],
    [madamis, editData],
  );

  const playersToRemove = useMemo(
    () =>
      madamis?.games
        .filter((g) => (gameId ? g.id !== gameId : true))
        .flatMap((g) => g.gameUsers.map((u) => u.user.id.toString())),
    [madamis, gameId],
  );

  const formSchema = z.object({
    players: z.array(z.string()).length(madamis?.player ?? 0),
    gm: z.string().refine((v) => userIds.includes(v)),
    date: z.date(),
  });

  type FormSchema = z.infer<typeof formSchema>;

  const {
    register,
    watch,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gm: editData?.gameUsers.find((u) => u.gm)?.user.id.toString() ?? "1",
    },
  });

  const onSubmit = async (data: FormSchema) => {
    setLoading(true);
    const reqObj = {
      madamisId: madamisId!,
      date: data.date.toISOString(),
      gm: Number.parseInt(data.gm),
      players: data.players.map((p) => Number.parseInt(p)),
    };
    if (gameId) {
      await client.games.$put({
        json: { id: gameId!, ...reqObj },
      });
    } else {
      await client.games.$post({
        json: reqObj,
      });
    }
    await mutate();
    close();
    reset();
    setLoading(false);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    reset();
    if (editData) {
      setValue("players", defaultPlayers);
      setValue("date", new Date(editData.date));
    }
  }, [gameId, open]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset legend="試合情報">
        <Stack>
          {madamis && users && (
            <>
              <Title order={3}>{madamis.title}</Title>
              <Group>
                <Badge
                  size="xl"
                  color={gmRequiredBadgeColor[madamis.gmRequired]}
                >
                  {gmRequired[madamis.gmRequired]}
                </Badge>
                <Badge size="xl" color="violet">
                  PL: {madamis.player}人
                </Badge>
              </Group>
              <NativeSelect
                label={gmRole[madamis.gmRequired]}
                data={users.map((u) => ({
                  label: u.name,
                  value: u.id.toString(),
                }))}
                {...register("gm")}
                error={errors.gm?.message}
              />
              <Stack gap="sm">
                <Text>プレイヤー</Text>
                <Chip.Group
                  multiple
                  value={watch("players")}
                  onChange={(e) => {
                    setValue("players", e);
                  }}
                >
                  <Group gap="sm" justify="center">
                    {users
                      .filter(
                        (u) =>
                          !playersToRemove?.includes(u.id.toString()) &&
                          !(
                            madamis.gmRequired === 1 &&
                            u.id === Number.parseInt(watch("gm"))
                          ),
                      )
                      .map((u) => (
                        <Chip value={u.id.toString()} key={u.id} color="teal">
                          {u.name}
                        </Chip>
                      ))}
                  </Group>
                </Chip.Group>
                {errors.players && (
                  <Text size="sm" c="red">
                    {errors.players.message}
                  </Text>
                )}
              </Stack>
            </>
          )}
          <DateInput
            value={watch("date")}
            onChange={(e) => {
              if (e) {
                setValue("date", e);
              }
            }}
            label="開催日"
            weekdayFormat="ddd"
            monthsListFormat="MM"
            decadeLabelFormat="YYYY"
            monthLabelFormat="YYYY/MM"
            valueFormat="YYYY/MM/DD"
            firstDayOfWeek={0}
            error={errors.date?.message}
          />
          <Button mt="md" type="submit" loading={loading}>
            {editData ? "更新" : "追加"}
          </Button>
          {gameId && <DeleteGameButton gameId={gameId} />}
        </Stack>
      </Fieldset>
    </form>
  );
};

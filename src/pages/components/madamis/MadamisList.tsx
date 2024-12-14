import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Chip,
  Group,
  Loader,
  NavLink,
  Select,
  Stack,
} from "@mantine/core";
import { Link, PencilSimple } from "@phosphor-icons/react";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import {
  gmRequired,
  gmRequiredBadgeColor,
} from "../../../constants/gmRequired";
import { useMadamisList } from "../../hooks/useMadamisList";
import { useUser } from "../../hooks/useUser";
import { useMadamisModalStore } from "../../stores/madamisModalStore";
import { AddGameButton } from "./../games/AddGamesButton";
import { GameState } from "./../games/GameState";

export const MadamisList = () => {
  const { data: madamis, isLoading } = useMadamisList();
  const { data: users } = useUser();
  const { editOpen } = useMadamisModalStore();

  const [onlyNotPlayed, updatePlayed] = useState(false);
  const [onlyPlayable, updatePlayable] = useState(false);
  const [players, setPlayers] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Group p="sm" justify="center">
        <Loader size="xl" />
      </Group>
    );
  }

  return (
    <Stack p="sm" align="center">
      <Group justify="center">
        <Chip
          size="xl"
          checked={onlyNotPlayed}
          onChange={(e) => {
            updatePlayed(e);
          }}
        >
          未プレイのみ
        </Chip>
        <Chip
          size="xl"
          checked={onlyPlayable}
          onChange={(e) => {
            updatePlayable(e);
          }}
        >
          プレイ可能のみ
        </Chip>
        <Select
          placeholder="遊ぶ人数"
          size="md"
          radius="xl"
          variant="filled"
          data={[
            {
              value: "2",
              label: "2人",
            },
            {
              value: "3",
              label: "3人",
            },
            {
              value: "4",
              label: "4人",
            },
            {
              value: "5",
              label: "5人",
            },
            {
              value: "6",
              label: "6人",
            },
            {
              value: "7",
              label: "7人",
            },
          ]}
          value={players}
          onChange={setPlayers}
        />
      </Group>
      <Group justify="center">
        {madamis &&
          users &&
          madamis
            .filter((d) => (onlyNotPlayed ? d.games.length === 0 : true))
            .filter((d) =>
              onlyPlayable
                ? d.bought &&
                  users.length - d.games.length * d.player > d.player
                : true,
            )
            .filter((d) =>
              !players
                ? true
                : d.gmRequired !== 2
                  ? d.gmRequired === 1
                    ? d.player + 1 === Number.parseInt(players)
                    : d.player + 1 === Number.parseInt(players) ||
                      d.player === Number.parseInt(players)
                  : d.player === Number.parseInt(players),
            )
            .map((d) => (
              <Card
                key={d.id}
                w="20rem"
                shadow="sm"
                p="md"
                radius="md"
                withBorder
              >
                <Stack>
                  <NavLink
                    href={d.link}
                    target="_blank"
                    label={d.title}
                    variant="subtle"
                    active
                    leftSection={<Link fontSize="1.4rem" />}
                    style={{
                      borderRadius: "4px",
                    }}
                  />
                  <Group>
                    <Badge size="xl" color={gmRequiredBadgeColor[d.gmRequired]}>
                      {gmRequired[d.gmRequired]}
                    </Badge>
                    <Badge size="xl" color="violet">
                      PL: {d.player}人
                    </Badge>
                    <ActionIcon
                      size="lg"
                      radius="xl"
                      variant="light"
                      disabled={d.games.length > 0}
                    >
                      <PencilSimple
                        fontSize="1.4rem"
                        onClick={() => {
                          editOpen(d.id);
                        }}
                      />
                    </ActionIcon>
                  </Group>
                  {d.games.length > 0 && (
                    <Stack>
                      {d.games.map((g) => (
                        <Fragment key={g.id}>
                          <GameState game={g} />
                        </Fragment>
                      ))}
                    </Stack>
                  )}
                  {d.bought ? (
                    <AddGameButton madamisId={d.id} />
                  ) : (
                    <Button disabled>未購入</Button>
                  )}
                </Stack>
              </Card>
            ))}
      </Group>
    </Stack>
  );
};

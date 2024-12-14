import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  Fieldset,
  Modal,
  NativeSelect,
  SegmentedControl,
  Stack,
  TextInput,
} from "@mantine/core";
import { hc } from "hono/client";

import type { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { AppType } from "../../../api";
import type { madamisPutSchema } from "../../../apis/madamis";
import { gmRequired } from "../../../constants/gmRequired";
import { useMadamisList } from "../../hooks/useMadamisList";
import { useMadamisModalStore } from "../../stores/madamisModalStore";
import { DeleteMadamisButton } from "./DeleteMadamisModal";

const client = hc<AppType>("/api");

export const MadamisModal = () => {
  const { data } = useMadamisList();
  const { open, close, madamisId } = useMadamisModalStore();

  const editData = madamisId
    ? data?.find((d) => d.id === madamisId)
    : undefined;

  return (
    <Modal
      opened={open}
      onClose={close}
      title={`マダミスを${editData ? "編集" : "追加"}`}
      centered
      closeOnClickOutside={false}
    >
      <MadamisForm editData={editData} />
    </Modal>
  );
};

const MadamisForm: FC<{
  editData?: z.infer<typeof madamisPutSchema>;
}> = ({ editData }) => {
  const { data, mutate } = useMadamisList();
  const { close, madamisId } = useMadamisModalStore();

  const formSchema = z.object({
    title: z.string().min(1),
    link: z
      .string()
      .url()
      .refine(
        (v) =>
          !data
            ?.filter((d) => (madamisId ? d.id !== madamisId : true))
            .map((d) => d.link)
            .includes(v),
        {
          message: "Already exists",
        },
      ),
    player: z.coerce.number().int().min(1).max(6),
    gmRequired: z.number().nonnegative().max(2),
    bought: z.boolean(),
  });

  type FormSchema = z.infer<typeof formSchema>;

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: editData?.title,
      link: editData?.link,
      player: editData?.player ?? 4,
      gmRequired: editData?.gmRequired ?? 0,
      bought: Boolean(editData?.bought),
    },
  });

  const onSubmit = async (data: FormSchema) => {
    if (madamisId) {
      await client.madamis.$put({
        json: { id: madamisId, ...data },
      });
    } else {
      await client.madamis.$post({
        json: data,
      });
    }
    await mutate();
    close();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset legend="マダミス情報">
        <Stack>
          <TextInput
            label="タイトル"
            placeholder="🧊山脈 陰謀の分水嶺"
            {...register("title")}
            error={errors.title?.message}
          />
          <TextInput
            label="リンク"
            placeholder="https://example.booth.pm"
            {...register("link")}
            error={errors.link?.message}
          />
          <NativeSelect
            label="PL人数"
            data={["1", "2", "3", "4", "5", "6"]}
            {...register("player")}
            error={errors.player?.message}
          />
          <SegmentedControl
            value={String(watch("gmRequired") ?? 0)}
            onChange={(e) => {
              setValue("gmRequired", Number(e));
            }}
            data={gmRequired.map((g, i) => ({
              label: g,
              value: i.toString(),
            }))}
          />
          <Checkbox
            label="購入済み"
            {...register("bought")}
            error={errors.bought?.message}
          />
          <Button type="submit" loading={isSubmitting}>
            {editData ? "更新" : "追加"}
          </Button>
          {madamisId && <DeleteMadamisButton madamisId={madamisId} />}
        </Stack>
      </Fieldset>
    </form>
  );
};

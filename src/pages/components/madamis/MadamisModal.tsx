import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  Fieldset,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  NativeSelect,
  SegmentedControl,
  VStack,
} from "@yamada-ui/react";
import { type InferResponseType, hc } from "hono/client";
import type { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import type { AppType } from "../../../api";
import { gmRequired } from "../../../constants/gmRequired";
import { useMadamisList } from "../../hooks/useMadamisList";
import { useMadamisModalStore } from "../../stores/madamisModalStore";
import { Loader } from "../Loader";
import { DeleteMadamisButton } from "./DeleteMadamisModal";

const client = hc<AppType>("/api");

const formSchema = (urls: ReadonlyArray<string>) =>
  z.object({
    title: z.string().min(1),
    link: z
      .string()
      .url()
      .refine((v) => !urls.includes(v), {
        message: "Already exists",
      }),
    player: z.coerce.number().int().min(1).max(6),
    gmRequired: z.number().nonnegative().max(2),
    bought: z.boolean(),
  });

export const MadamisModal = () => {
  const { data } = useMadamisList();
  const { open, onClose, madamisId } = useMadamisModalStore();

  const editData = madamisId
    ? data?.find((d) => d.id === madamisId)
    : undefined;

  const madamisUrls = data
    ?.filter((d) => (madamisId ? d.id !== madamisId : true))
    .map((d) => d.link);

  return (
    <Modal open={open} onClose={onClose} closeOnOverlay={false}>
      <ModalHeader>{`マダミスを${editData ? "編集" : "追加"}`}</ModalHeader>
      <ModalBody>
        {madamisUrls ? (
          <MadamisForm madamisUrls={madamisUrls} editData={editData} />
        ) : (
          <Loader />
        )}
      </ModalBody>
    </Modal>
  );
};

const MadamisForm: FC<{
  madamisUrls: ReadonlyArray<string>;
  editData?: InferResponseType<typeof client.madamis.$get>[number];
}> = ({ editData, madamisUrls }) => {
  const { mutate } = useMadamisList();
  const { onClose, madamisId } = useMadamisModalStore();

  const madamisFormSchema = formSchema(madamisUrls);
  type FormSchema = z.infer<typeof madamisFormSchema>;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(madamisFormSchema),
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
    onClose(); // FIXME: 閉じたときにスクロールが戻らない
  };

  return (
    <VStack as="form" onSubmit={handleSubmit(onSubmit)}>
      <Fieldset
        legend="タイトル"
        invalid={!!errors.title}
        errorMessage={errors.title?.message}
      >
        <Input placeholder="🧊山脈 陰謀の分水嶺" {...register("title")} />
      </Fieldset>
      <Fieldset
        legend="リンク"
        invalid={!!errors.link}
        errorMessage={errors.link?.message}
      >
        <Input placeholder="https://example.booth.pm" {...register("link")} />
      </Fieldset>
      <Fieldset
        legend="PL人数"
        invalid={!!errors.player}
        errorMessage={errors.player?.message}
      >
        <NativeSelect
          items={[
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
            { label: "5", value: "5" },
            { label: "6", value: "6" },
          ]}
          {...register("player")}
        />
      </Fieldset>
      <Controller
        control={control}
        name="gmRequired"
        render={({ field }) => (
          <SegmentedControl
            colorScheme="yellow"
            value={String(field.value)}
            onChange={(e) => {
              field.onChange(Number(e));
            }}
            items={gmRequired.map((g, i) => ({
              label: g,
              value: i.toString(),
            }))}
          />
        )}
      />
      <Checkbox label="購入済み/無料" size="lg" {...register("bought")} />
      <Button type="submit" colorScheme="lime" loading={isSubmitting}>
        {editData ? "更新" : "追加"}
      </Button>
      {madamisId && <DeleteMadamisButton madamisId={madamisId} />}
    </VStack>
  );
};

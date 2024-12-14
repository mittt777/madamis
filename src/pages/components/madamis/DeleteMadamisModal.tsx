import { Button, Group, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { hc } from "hono/client";
import { type FC, useState } from "react";
import type { AppType } from "../../../api";
import { useMadamisList } from "../../hooks/useMadamisList";
import { useMadamisModalStore } from "../../stores/madamisModalStore";

const client = hc<AppType>("/api");

const DeleteMadamisModal: FC<{
  madamisId: number;
  opened: boolean;
  close: () => void;
}> = ({ madamisId, opened, close }) => {
  const { close: closeMadamisModal } = useMadamisModalStore();
  const { mutate } = useMadamisList();

  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    await client.madamis[":id"].$delete({
      param: { id: madamisId.toString() },
    });
    await mutate();
    closeMadamisModal();
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      size="sm"
      title="削除しますか？"
    >
      <Group>
        <Button color="red" onClick={onDelete} loading={loading}>
          削除する
        </Button>
        <Button color="blue" variant="light" onClick={close} loading={loading}>
          削除しない
        </Button>
      </Group>
    </Modal>
  );
};

export const DeleteMadamisButton: FC<{ madamisId: number }> = ({
  madamisId,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button color="red" variant="light" onClick={open}>
        削除
      </Button>
      <DeleteMadamisModal madamisId={madamisId} opened={opened} close={close} />
    </>
  );
};

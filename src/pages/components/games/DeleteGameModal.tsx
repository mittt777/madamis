import { Button, Group, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { hc } from "hono/client";
import { type FC, useState } from "react";
import type { AppType } from "../../../api";
import { useMadamisList } from "../../hooks/useMadamisList";
import { useGameModalStore } from "../../stores/gameModalStore";

const client = hc<AppType>("/api");

const DeleteGameModal: FC<{
  gameId: number;
  opened: boolean;
  close: () => void;
}> = ({ gameId, opened, close }) => {
  const { close: closeGameModal } = useGameModalStore();
  const { mutate } = useMadamisList();

  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    await client.games[":id"].$delete({
      param: { id: gameId.toString() },
    });
    await mutate();
    closeGameModal();
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

export const DeleteGameButton: FC<{ gameId: number }> = ({ gameId }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button color="red" variant="light" onClick={open}>
        削除
      </Button>
      <DeleteGameModal gameId={gameId} opened={opened} close={close} />
    </>
  );
};

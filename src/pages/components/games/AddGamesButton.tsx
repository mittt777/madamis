import { Button } from "@mantine/core";
import { useMadamisList } from "../../hooks/useMadamisList";
import { useUser } from "../../hooks/useUser";
import { useGameModalStore } from "../../stores/gameModalStore";

export const AddGameButton = ({ madamisId }: { madamisId: number }) => {
  const { data: madamisList } = useMadamisList();
  const { data: users } = useUser();
  const { createOpen } = useGameModalStore();

  const madamis = madamisList?.find((m) => m.id === madamisId);
  const playedPlayers = Array.from(
    new Set(madamis?.games.flatMap((g) => g.gameUsers.map((u) => u.user.id))),
  ).length;

  return (
    <>
      {madamis &&
      users &&
      users.length - playedPlayers + (madamis.gmRequired === 1 ? 0 : 1) >
        madamis.player ? (
        <Button
          variant="light"
          onClick={() => {
            createOpen(madamisId);
          }}
        >
          試合を追加
        </Button>
      ) : (
        <Button disabled>プレイ済</Button>
      )}
    </>
  );
};

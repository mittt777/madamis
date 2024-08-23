import {
  ActionIcon,
  Badge,
  Group,
  Paper,
  Stack,
  useMantineColorScheme,
} from "@mantine/core";
import { PencilSimple } from "@phosphor-icons/react";
import { useGameModalStore } from "../stores/gameModalStore";

// 型を定義から取りたいが.. https://github.com/drizzle-team/drizzle-orm/discussions/1483
export const GameState = ({
  game,
}: {
  game: {
    id: number;
    madamisId: number;
    date: string;
    gameUsers: ReadonlyArray<{
      id: number;
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
}) => {
  const { colorScheme } = useMantineColorScheme();
  const { editOpen } = useGameModalStore();

  const date = new Date(game.date).toLocaleDateString("ja-JP");

  return (
    <Paper p="xs" withBorder>
      <Stack gap="xs">
        <Group gap="xs">
          <Badge
            color={colorScheme === "dark" ? "gray" : "gray.1"}
            c={colorScheme === "dark" ? "white" : "dark"}
          >
            プレイ日時: {date}
          </Badge>
          <ActionIcon
            size="sm"
            variant="light"
            radius="xl"
            onClick={() => {
              editOpen(game.madamisId, game.id);
            }}
          >
            <PencilSimple />
          </ActionIcon>
        </Group>
        <Group gap="xs" justify="center">
          {game.gameUsers.map((u) => (
            <Badge
              key={u.id}
              color={
                u.gm ? "orange" : colorScheme === "dark" ? "gray" : "gray.1"
              }
              size="sm"
              c={u.gm ? "white" : u.user.color}
            >
              {u.user.name}
            </Badge>
          ))}
        </Group>
      </Stack>
    </Paper>
  );
};

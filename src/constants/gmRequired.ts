import type { DefaultMantineColor } from "@mantine/core";

export const gmRequired = ["GM: 任意", "GM: 必須", "GM: なし"] as const;
export const gmRole = ["GM/進行役", "GM", "進行役"] as const;
export const gmRequiredBadgeColor = [
  "cyan",
  "orange",
  "green",
] as const satisfies ReadonlyArray<DefaultMantineColor>;

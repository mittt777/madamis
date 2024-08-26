import { relations } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

//　マダミスシナリオ情報テーブル
export const madamis = sqliteTable("Madamis", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  link: text("link").notNull().unique(),
  player: integer("player").notNull(), // プレイヤー人数
  gmRequired: integer("gmRequired").notNull(), // GM必須シナリオか否か
  bought: integer("bought").notNull(), // 買ったか否か
});

export const madamisRelations = relations(madamis, ({ many }) => ({
  games: many(games),
}));

// 試合情報テーブル
export const games = sqliteTable("Games", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  date: text("date").notNull(), // 試合日

  madamisId: integer("madamisId")
    .references(() => madamis.id)
    .notNull(),
});

export const gamesRelations = relations(games, ({ one, many }) => ({
  madamis: one(madamis, {
    fields: [games.madamisId],
    references: [madamis.id],
  }),
  gameUsers: many(gameUsers),
}));

// ユーザー情報テーブル
export const users = sqliteTable("Users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  color: text("color").notNull(), // カラーコード
});

export const usersRelations = relations(users, ({ many }) => ({
  gameUsers: many(gameUsers),
}));

// 試合・ユーザーの中間テーブル
export const gameUsers = sqliteTable(
  "GameUsers",
  {
    gm: integer("gm").notNull(), // GMか否か

    gameId: integer("gameId")
      .references(() => games.id)
      .notNull(),
    userId: integer("userId")
      .references(() => users.id)
      .notNull(),
  },
  (table) => {
    // 複合主キー
    return {
      pk: primaryKey({ columns: [table.gameId, table.userId] }),
      pkWithCustomName: primaryKey({
        name: "gu_pk",
        columns: [table.gameId, table.userId],
      }),
    };
  }
);

export const usersToGamesRelations = relations(gameUsers, ({ one }) => ({
  game: one(games, {
    fields: [gameUsers.gameId],
    references: [games.id],
  }),
  user: one(users, {
    fields: [gameUsers.userId],
    references: [users.id],
  }),
}));

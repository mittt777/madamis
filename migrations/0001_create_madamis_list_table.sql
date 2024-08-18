-- CreateTable
CREATE TABLE "Madamis" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Games" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "madamisId" INTEGER NOT NULL,
    CONSTRAINT "Games_madamisId_fkey" FOREIGN KEY ("madamisId") REFERENCES "Madamis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GameUsers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gamesId" INTEGER,
    "usersId" INTEGER,
    CONSTRAINT "GameUsers_gamesId_fkey" FOREIGN KEY ("gamesId") REFERENCES "Games" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GameUsers_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Madamis_link_key" ON "Madamis"("link");

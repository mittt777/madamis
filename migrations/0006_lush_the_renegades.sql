ALTER TABLE `GameUsers` RENAME TO `OldGameUsers`;
CREATE TABLE `GameUsers` (
	`gameId` integer NOT NULL,
	`userId` integer NOT NULL,
	`gm` integer NOT NULL,
	FOREIGN KEY (`gameId`) REFERENCES `Games`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON UPDATE no action ON DELETE no action,
	PRIMARY KEY (`gameId`, `userId`)
);
INSERT INTO `GameUsers` SELECT `gameId`, `userId`, `gm` FROM `OldGameUsers`;
DROP TABLE `OldGameUsers`;
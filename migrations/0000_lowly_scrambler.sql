CREATE TABLE `notes` (
	`content` text NOT NULL,
	`created_at` integer,
	`creator_id` text,
	`id` text PRIMARY KEY NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `user` (
	`created_at` integer,
	`email` text,
	`id` text PRIMARY KEY NOT NULL,
	`updated_at` integer,
	`nickname` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);
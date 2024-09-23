CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`content` text NOT NULL,
	`creator_id` text
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`user_agent` text,
	`user_id` text,
	`disabled` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`email` text NOT NULL,
	`nickname` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);
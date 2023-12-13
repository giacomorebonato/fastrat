CREATE TABLE `notes` (
	`content` text NOT NULL,
	`created_at` integer,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `user` (
	`created_at` integer,
	`email` text,
	`id` text PRIMARY KEY NOT NULL,
	`updated_at` integer
);

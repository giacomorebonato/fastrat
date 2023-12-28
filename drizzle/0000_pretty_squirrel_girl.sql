CREATE TABLE `collaboration` (
	`content` blob NOT NULL,
	`content_text` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`completed` integer DEFAULT 0,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`collaboration_id` text,
	`content` text NOT NULL,
	`created_at` integer,
	`creator_id` text,
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

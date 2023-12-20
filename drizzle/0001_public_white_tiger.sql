CREATE TABLE `collaboration` (
	`content` blob,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`completed` integer DEFAULT 0,
	`title` text NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
ALTER TABLE notes ADD `collaboration_id` text;--> statement-breakpoint
ALTER TABLE notes ADD `creator_id` text;
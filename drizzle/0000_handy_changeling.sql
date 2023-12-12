CREATE TABLE `notes` (
	`content` text NOT NULL,
	`created_at` integer,
	`id` text PRIMARY KEY NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `user_keys` (
	`hashed_password` text,
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_sessions` (
	`id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL
);

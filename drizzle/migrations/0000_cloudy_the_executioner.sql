CREATE TABLE `after_metrics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`applications` text NOT NULL,
	`vip_guests` text NOT NULL,
	`supporter` text NOT NULL,
	`speakers_count` text NOT NULL,
	`working_participant` text NOT NULL,
	`job_seeker` text NOT NULL,
	`job_provider` text NOT NULL,
	`satisfaction` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `announcements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`show` integer DEFAULT false NOT NULL,
	`text` text NOT NULL,
	`background_color` text NOT NULL,
	`text_color` text NOT NULL,
	`link` text,
	`link_text` text,
	`show_link` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `event_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`url` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`navigable` integer DEFAULT true,
	`name` text NOT NULL,
	`hero_description` text NOT NULL,
	`card_description` text NOT NULL,
	`register_link` text NOT NULL,
	`video_url` text,
	`date` text NOT NULL,
	`location_name` text NOT NULL,
	`location_subtext` text NOT NULL,
	`location_latitude` real,
	`location_longitude` real,
	`color_primary` text NOT NULL,
	`color_secondary` text NOT NULL,
	`color_accent` text NOT NULL,
	`color_background` text NOT NULL,
	`color_text` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `initial_metrics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`title` text NOT NULL,
	`value` integer NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `organizers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`name` text NOT NULL,
	`designation` text NOT NULL,
	`image` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`room` text NOT NULL,
	`speaker_name` text NOT NULL,
	`topic` text,
	`start_time` text,
	`end_time` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `speakers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`full_name` text NOT NULL,
	`title` text NOT NULL,
	`company` text,
	`instagram` text,
	`linkedin` text,
	`twitter` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sponsors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`tier` text NOT NULL,
	`sponsor_slug` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`price` real NOT NULL,
	`link` text NOT NULL,
	`perks` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);

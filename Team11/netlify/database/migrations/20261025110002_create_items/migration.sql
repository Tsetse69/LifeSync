CREATE TABLE "items" (
	"user_id" text,
	"id" text,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"date" text NOT NULL,
	"amount" double precision,
	"priority" text DEFAULT 'Normal' NOT NULL,
	"reminder" text DEFAULT 'none' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "items_pkey" PRIMARY KEY("user_id","id")
);

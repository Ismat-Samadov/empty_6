CREATE SCHEMA "kreditor";
--> statement-breakpoint
CREATE TYPE "kreditor"."admin_role" AS ENUM('admin', 'baxici');--> statement-breakpoint
CREATE TYPE "kreditor"."application_status" AS ENUM('gozlemede', 'baxilir', 'tesdiq_edildi', 'red_edildi');--> statement-breakpoint
CREATE TABLE "kreditor"."application_banks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"bank_id" uuid NOT NULL,
	"status" "kreditor"."application_status" DEFAULT 'gozlemede' NOT NULL,
	"notes" text,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kreditor"."bank_admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bank_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "kreditor"."admin_role" DEFAULT 'admin' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bank_admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "kreditor"."banks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"logo_url" text,
	"description" text,
	"website_url" text,
	"phone_number" varchar(30),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "banks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "kreditor"."loan_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"fin_code" varchar(20) NOT NULL,
	"full_name" varchar(255),
	"ip_address" varchar(45),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "kreditor"."application_banks" ADD CONSTRAINT "application_banks_application_id_loan_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "kreditor"."loan_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kreditor"."application_banks" ADD CONSTRAINT "application_banks_bank_id_banks_id_fk" FOREIGN KEY ("bank_id") REFERENCES "kreditor"."banks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kreditor"."bank_admins" ADD CONSTRAINT "bank_admins_bank_id_banks_id_fk" FOREIGN KEY ("bank_id") REFERENCES "kreditor"."banks"("id") ON DELETE cascade ON UPDATE no action;
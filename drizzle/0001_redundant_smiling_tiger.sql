CREATE TABLE IF NOT EXISTS "inventries" (
	"id" serial PRIMARY KEY NOT NULL,
	"sku" varchar(8) NOT NULL,
	"order_id" integer,
	"warehouse_id" integer,
	"product_id" integer,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "inventries_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventries" ADD CONSTRAINT "inventries_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventries" ADD CONSTRAINT "inventries_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventries" ADD CONSTRAINT "inventries_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "inventries" RENAME TO "inventories";--> statement-breakpoint
ALTER TABLE "inventories" DROP CONSTRAINT "inventries_sku_unique";--> statement-breakpoint
ALTER TABLE "inventories" DROP CONSTRAINT "inventries_order_id_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "inventories" DROP CONSTRAINT "inventries_warehouse_id_warehouses_id_fk";
--> statement-breakpoint
ALTER TABLE "inventories" DROP CONSTRAINT "inventries_product_id_products_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventories" ADD CONSTRAINT "inventories_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventories" ADD CONSTRAINT "inventories_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventories" ADD CONSTRAINT "inventories_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_sku_unique" UNIQUE("sku");
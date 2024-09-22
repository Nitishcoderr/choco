ALTER TABLE "orders" ADD COLUMN "razorpay_order_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_razorpay_order_id_unique" UNIQUE("razorpay_order_id");
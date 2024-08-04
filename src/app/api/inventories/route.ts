import { db } from "@/lib/db/db";
import { inventories, products, warehouses } from "@/lib/db/schema";
import { inventorySchema } from "@/lib/validators/inventoriesSchema";
import { desc, eq } from "drizzle-orm";

export async function POST(request:Request) {
     const requestData = await request.json();
     let validateData;
     try {
        validateData = await inventorySchema.parse(requestData)
        
     } catch (error) {
        return Response.json({ message: error }, { status: 400 });
     }

     try {
        await db.insert(inventories).values(validateData);
        return Response.json({ message: "OK" }, { status: 201 });
     } catch (error) {
        return Response.json({ message: "Failed to store the inventories" }, { status: 500 });
     }
}


export async function GET(){
   try {
      const inventoriesData = await db.select({
         id:inventories.id,
         sku:inventories.sku,
         warehouses:warehouses.name,
         products:products.name,
      }).from(inventories)
      .leftJoin(warehouses,eq(inventories.warehouseId,warehouses.id))
      .leftJoin(products,eq(inventories.productId,products.id))
      .orderBy(desc(inventories.id));
      return Response.json(inventoriesData)
   } catch (error) {
      return Response.json({ message: "Failed to fetch the inventories data" }, { status: 500 });
   }
}
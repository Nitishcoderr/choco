import { authOptions } from '@/lib/auth/authOptions';
import { db } from '@/lib/db/db';
import { deliveryPersons, warehouses } from '@/lib/db/schema';
import { deliveryPersonSchema } from '@/lib/validators/deliveryPersonSchema';
import { desc, eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

// Create delivery person
export async function POST(request: Request) {
  //  check user access
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ message: 'Not allowed' }, { status: 401 });
  }
  // @ts-ignore
  if(session.token.role !== 'admin'){
    return Response.json({ message: 'Not allowed' }, { status: 403 });
  }
  const requestData = await request.json();
  let validatedData;
  try {
    validatedData = await deliveryPersonSchema.parse(requestData);
  } catch (error) {
    return Response.json({ message: error }, { status: 400 });
  }
  try {
    await db.insert(deliveryPersons).values(validatedData);
    return Response.json({ message: 'ok' }, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: 'Failed to store the delivery person in database' },
      { status: 500 }
    );
  }
}

// get delivery person
export async function GET() {
  try {
    const allDeliveryPersons = await db
      .select({
        id: deliveryPersons.id,
        name: deliveryPersons.name,
        phone: deliveryPersons.phone,
        warehouse: warehouses.name,
      })
      .from(deliveryPersons)
      .leftJoin(warehouses, eq(deliveryPersons.warehouseId, warehouses.id))
      .orderBy(desc(deliveryPersons.id));
    return Response.json(allDeliveryPersons);
  } catch (error) {
    return Response.json(
      { message: 'Failed to fetch the delivery person in database' },
      { status: 500 }
    );
  }
}

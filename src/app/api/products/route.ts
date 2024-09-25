import { authOptions } from '@/lib/auth/authOptions';
import { db } from '@/lib/db/db';
import { products } from '@/lib/db/schema';
import { productSchema } from '@/lib/validators/productSchema';
import { desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

// CREATE PRODUCTS
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
  const data = await request.formData();
  let validatedData;
  try {
    validatedData = productSchema.parse({
      name: data.get('name'),
      description: data.get('description'),
      price: Number(data.get('price')),
      image: data.get('image'),
    });
  } catch (error) {
    return Response.json({ message: error }, { status: 400 });
  }
 // @ts-ignore
  const filename = `${Date.now()}.${validatedData.image.name.split('.').slice(-1)}`; //34234234234.jpg

  try {
     // @ts-ignore
    const buffer = Buffer.from(await validatedData.image.arrayBuffer());
    await writeFile(path.join(process.cwd(), 'public/assets', filename), buffer);
  } catch (error) {
    return Response.json({ message: 'Failed to save the file to fs' }, { status: 500 });
  }

  const dataToStore = { ...validatedData, image: filename };
  console.log('Data to be stored in the database:', dataToStore);

  try {
    await db.insert(products).values({ ...validatedData, image: filename });
  } catch (error) {
    // remove stored image from fs
    await unlink(path.join(process.cwd(), 'public/assets', filename));
    return Response.json({ message: 'Failed to store product into the database' }, { status: 500 });
  }
  return Response.json({ message: 'OK' }, { status: 201 });
}

// GET PRODUCTS
export async function GET() {
  try {
    const allProducts = await db.select().from(products).orderBy(desc(products.id));
    return Response.json(allProducts);
  } catch (error) {
    return Response.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}

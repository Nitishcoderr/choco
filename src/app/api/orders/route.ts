import { authOptions } from '@/lib/auth/authOptions';
import { db } from '@/lib/db/db';
import { deliveryPersons, inventories, orders, products, users, warehouses } from '@/lib/db/schema';
import { orderSchema } from '@/lib/validators/orderSchema';
import axios from 'axios';
import { and, desc, eq, inArray, isNull } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_eTb7TA1byeyQrp',
  key_secret: process.env.RAZORPAY_SECRET || 'rpYqwHsFChUEwLtqGgvaNazc',
});

// TO MAKE ORDER
export async function POST(request: Request) {
  // Get the session
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ message: 'Not allowed' }, { status: 401 });
  }

  // Parse and validate request data
  const requestData = await request.json();
  let validateData;
  try {
    validateData = await orderSchema.parse(requestData);
  } catch (error) {
    return Response.json({ message: error }, { status: 400 });
  }


  const warehouseResult = await db
  .select({ id: warehouses.id })
  .from(warehouses)
  .where(eq(warehouses.pincode, validateData.pincode));

if (!warehouseResult.length) {
  return Response.json({ message: 'No warehouse found' }, { status: 400 });
}

const foundProduct = await db
.select()
.from(products)
.where(eq(products.id, validateData.productId))
.limit(1);

if (!foundProduct.length) {
return Response.json({ message: 'No product found' }, { status: 400 });
}

  // Calculate total amount in paise
  const productPrice = foundProduct[0].price;
  const amount = productPrice * validateData.qty * 100; // Amount in paise

  // Create order in the database
  let finalOrder;
  let transactionError: string = '';
  try {
    finalOrder = await db.transaction(async (tx) => {
      const order = await tx
        .insert(orders)
        .values({
          ...validateData,
          //  @ts-ignore
          userId: session.token.id,
          price: foundProduct[0].price * validateData.qty,
          // TODO: move all status to enum or const
          status: 'received',
        })
        .returning({ id: orders.id, price: orders.price });

      // Perform inventory and delivery checks

      // Check stock availability
      const availableStock = await tx
                .select()
                .from(inventories)
                .where(
                    and(
                        eq(inventories.warehouseId, warehouseResult[0].id),
                        eq(inventories.productId, validateData.productId),
                        isNull(inventories.orderId)
                    )
                )
                .limit(validateData.qty)
                .for('update', { skipLocked: true });

            if (availableStock.length < validateData.qty) {
                transactionError = `Stock is low, only ${availableStock.length} products available`;
                tx.rollback();
                return;
            }

      // Check for available delivery persons
      const availablePersons = await tx
      .select()
      .from(deliveryPersons)
      .where(
          and(
              isNull(deliveryPersons.orderId),
              eq(deliveryPersons.warehouseId, warehouseResult[0].id)
          )
      )
      .for('update')
      .limit(1);

  if (!availablePersons.length) {
      transactionError = `Delivery person is not available at the moment`;
      tx.rollback();
      return;
  }

      // Update inventories and delivery persons
      await tx
        .update(inventories)
        .set({ orderId: order[0].id })
        .where(
          inArray(
            inventories.id,
            availableStock.map((stock) => stock.id)
          )
        );

      await tx
        .update(deliveryPersons)
        .set({ orderId: order[0].id })
        .where(eq(deliveryPersons.id, availablePersons[0].id));

      // Update order status
      await tx.update(orders).set({ status: 'reserved' }).where(eq(orders.id, order[0].id));

      return order[0];
    });
  } catch (error) {
    // log
    // in production -> be careful don't return internal errors to the client.
    return Response.json(
        {
            message: transactionError ? transactionError : 'Error while db transaction',
        },
        { status: 500 }
    );
}

  // Create a Razorpay order
  let razorpayOrder;
  try {
    razorpayOrder = await razorpay.orders.create({
      amount: amount,
      currency: 'INR',
      //  @ts-ignore
      receipt: `order_rcptid_${finalOrder.id}`,
      payment_capture: true, // Auto-capture payment
    });
    // Update the order with the Razorpay order ID
    await db
      .update(orders)
      .set({ razorpayOrderId: razorpayOrder.id }) // Store Razorpay order ID
      //  @ts-ignore
      .where(eq(orders.id, finalOrder.id));
  } catch (error) {
    console.error('Failed to create Razorpay order');
    return NextResponse.json({ message: 'Failed to create payment order' }, { status: 500 });
  }

  return NextResponse.json({
    id: razorpayOrder.id, // Razorpay order ID
    amount: razorpayOrder.amount, // Order amount in paise
    currency: razorpayOrder.currency, // Order currency
  });
}

// TO LIST ORDERS

export async function GET(request: Request) {
  // TODO : add authentication and authorization
  // TODO : add login and error handling
  const allOrders = await db
    .select({
      id: orders.id,
      product: products.name,
      productId: products.id,
      userId: users.id,
      user: users.fname,
      type: orders.type,
      order_id: orders.razorpayOrderId,
      status: orders.status,
      price: orders.price,
      image: products.image,
      address: orders.address,
      qty: orders.qty,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .leftJoin(products, eq(orders.productId, products.id))
    .leftJoin(users, eq(orders.userId, users.id))
    // TODO join inventories (orderID)
    // TODO join delivery person (orderID)
    // TODO join warehouse (delivery ID)
    // TODO 1. use pagination 2. Put index
    .orderBy(desc(orders.id));
  return Response.json(allOrders);
}

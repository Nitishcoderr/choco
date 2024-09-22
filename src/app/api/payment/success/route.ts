  import { db } from '@/lib/db/db';
  import { deliveryPersons, inventories, orders } from '@/lib/db/schema';
  import { eq, sql } from 'drizzle-orm';
  import crypto from 'node:crypto';
  import { NextResponse } from 'next/server';

  export async function POST(request: Request) {
    const data = await request.json();
    console.log('Raw payload:', data);
  
    if (data.isfinal === true && data.status === 'paid') {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = data;
      
      // Construct the string to be signed
      const stringData = razorpay_order_id + '|' + razorpay_payment_id;
      
      // Generate expected signature using HMAC-SHA256
      const expectedSign = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rpYqwHsFChUEwLtqGgvaNazc')
        .update(stringData)
        .digest('hex');
  
      // Verify the signature
      if (razorpay_signature !== expectedSign) {
        console.error('Signature verification failed:', { originalSign: razorpay_signature, expectedSign });
        return NextResponse.json({ message: 'Payment verification failed' }, { status: 400 });
      }
      // 2. Update the order status to 'paid' if signature verification passes
      try {
        await db
        await db.update(orders)
        .set({ status: 'paid' })
        .where(eq(orders.razorpayOrderId, razorpay_order_id));
    
        return NextResponse.json({ message: 'Payment successful and order updated' }, { status: 200 });
      } catch (error) {
        console.error('Error updating order status:', error);
        return NextResponse.json({ message: 'Failed to update order status' }, { status: 500 });
      }
    } else if (data.isfinal === true && data.status === 'fail') {
      const orderIdStr = data.order_id;
      const orderId = parseInt(orderIdStr, 10);  // Ensure the order_id is an integer
      console.log('Order ID (parsed) for failure case:', orderId);

      // 3. Handle payment failure by cleaning up references and deleting the order
      try {
        await db
          .update(deliveryPersons)
          .set({ orderId: sql`NULL` })
          .where(eq(deliveryPersons.orderId, orderId));

        await db
          .update(inventories)
          .set({ orderId: sql`NULL` })
          .where(eq(inventories.orderId, orderId));

        await db
          .delete(orders)
          .where(eq(orders.id, orderId));

        return NextResponse.json({ message: 'Payment failed, order cancelled' }, { status: 200 });
      } catch (error) {
        console.error('Error handling failed payment:', error);
        return NextResponse.json({ message: 'Failed to cancel order' }, { status: 500 });
      }
    } else {
      console.log('Ignoring the event as it is not final');
      return NextResponse.json({});
    }
  }

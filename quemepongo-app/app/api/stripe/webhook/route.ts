import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // En producción, deberías verificar la firma del webhook
    // usando process.env.STRIPE_WEBHOOK_SECRET
    event = JSON.parse(body) as Stripe.Event;
  } catch (err) {
    console.error('Error parsing webhook:', err);
    return NextResponse.json(
      { error: 'Invalid payload' },
      { status: 400 }
    );
  }

  // Manejar los eventos de Stripe
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { planId, userEmail, credits } = session.metadata || {};

      console.log('Checkout completed:', {
        planId,
        userEmail,
        credits,
        customerId: session.customer,
        subscriptionId: session.subscription,
      });

      // Aquí deberías actualizar tu base de datos con la información del pago
      // Por ejemplo:
      // - Si es pago por uso: agregar créditos al usuario
      // - Si es suscripción: marcar al usuario como premium

      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription updated:', subscription.id, subscription.status);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription canceled:', subscription.id);
      // Aquí deberías revocar el acceso premium del usuario
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Invoice paid:', invoice.id);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Invoice payment failed:', invoice.id);
      // Aquí podrías notificar al usuario que su pago falló
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

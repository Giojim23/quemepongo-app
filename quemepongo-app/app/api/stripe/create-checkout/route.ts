import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Productos de Stripe
const PRODUCTS = {
  'pago-por-uso': {
    name: 'Pago por Uso - 3 Sugerencias',
    description: 'Obtén 3 sugerencias de outfit personalizadas',
    price: 390, // $3.90 USD en centavos
    mode: 'payment' as const,
  },
  'plan-mensual': {
    name: 'Plan Mensual Ilimitado',
    description: 'Sugerencias ilimitadas de outfits por un mes',
    price: 790, // $7.90 USD en centavos
    mode: 'subscription' as const,
  },
};

export async function POST(request: NextRequest) {
  try {
    const { planId, userEmail } = await request.json();

    if (!planId || !PRODUCTS[planId as keyof typeof PRODUCTS]) {
      return NextResponse.json(
        { error: 'Plan no válido' },
        { status: 400 }
      );
    }

    const product = PRODUCTS[planId as keyof typeof PRODUCTS];
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    if (product.mode === 'subscription') {
      // Crear producto y precio para suscripción
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer_email: userEmail,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: product.name,
                description: product.description,
              },
              unit_amount: product.price,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/planes/exito?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/planes?canceled=true`,
        metadata: {
          planId,
          userEmail,
        },
      });

      return NextResponse.json({ url: session.url });
    } else {
      // Pago único
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer_email: userEmail,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: product.name,
                description: product.description,
              },
              unit_amount: product.price,
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/planes/exito?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/planes?canceled=true`,
        metadata: {
          planId,
          userEmail,
          credits: '3', // 3 sugerencias
        },
      });

      return NextResponse.json({ url: session.url });
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error al crear la sesión de pago' },
      { status: 500 }
    );
  }
}

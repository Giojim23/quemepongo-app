'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PlanesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canceled = searchParams.get('canceled');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      router.push('/login?redirect=/planes');
      return;
    }

    setLoading(planId);
    setError(null);

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Error al procesar el pago');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF]">
      {/* Header */}
      <header className="bg-[#111111] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/dashboard">
              <img
                src="https://i.ibb.co/F4rv46Qk/quemepongo2.png"
                alt="Que Me Pongo?"
                style={{ height: '130px', width: 'auto' }}
              />
            </Link>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-[#C8A46A] text-sm">Hola, {user.name}!</span>
                  <Link
                    href="/dashboard"
                    className="bg-[#C8A46A] text-[#111111] px-4 py-2 rounded-lg font-semibold hover:bg-[#B8945A] transition-colors text-sm"
                  >
                    Volver al Dashboard
                  </Link>
                </>
              ) : (
                <Link
                  href="/login"
                  className="bg-[#C8A46A] text-[#111111] px-4 py-2 rounded-lg font-semibold hover:bg-[#B8945A] transition-colors text-sm"
                >
                  Iniciar sesion
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#111111] mb-4">
            Elige tu Plan
          </h1>
          <p className="text-[#8E8E8E] text-lg max-w-2xl mx-auto">
            Obtén sugerencias de outfits personalizadas basadas en tu estilo, clima y ocasion
          </p>
        </div>

        {/* Canceled message */}
        {canceled && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-center">
            El proceso de pago fue cancelado. Puedes intentarlo de nuevo cuando quieras.
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Pago por Uso */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-[#C8A46A] transition-all">
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#111111] mb-2">Pago por Uso</h2>
                <p className="text-[#8E8E8E]">Perfecto para probar el servicio</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#111111]">$3.90</span>
                  <span className="text-[#8E8E8E]">USD</span>
                </div>
                <p className="text-sm text-[#C8A46A] mt-1">Pago unico</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#C8A46A] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[#111111]"><strong>3 sugerencias</strong> de outfit</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#C8A46A] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[#111111]">Personalizadas a tu perfil</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#C8A46A] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[#111111]">Sin compromiso</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#C8A46A] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[#111111]">Valido por 30 dias</span>
                </li>
              </ul>

              <button
                onClick={() => handleSelectPlan('pago-por-uso')}
                disabled={loading === 'pago-por-uso'}
                className="w-full bg-[#111111] text-white py-3 rounded-lg font-semibold hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === 'pago-por-uso' ? 'Procesando...' : 'Comprar ahora'}
              </button>
            </div>
          </div>

          {/* Plan Mensual */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-[#C8A46A] relative">
            {/* Popular badge */}
            <div className="absolute top-0 right-0 bg-[#C8A46A] text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
              Mas Popular
            </div>

            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#111111] mb-2">Plan Mensual</h2>
                <p className="text-[#8E8E8E]">Para los amantes de la moda</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#111111]">$7.90</span>
                  <span className="text-[#8E8E8E]">USD/mes</span>
                </div>
                <p className="text-sm text-[#C8A46A] mt-1">Cancela cuando quieras</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#C8A46A] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[#111111]"><strong>Sugerencias ilimitadas</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#C8A46A] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[#111111]">Personalizadas a tu perfil</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#C8A46A] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[#111111]">Acceso a nuevas funciones</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#C8A46A] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[#111111]">Soporte prioritario</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#C8A46A] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[#111111]">Guardarropa virtual</span>
                </li>
              </ul>

              <button
                onClick={() => handleSelectPlan('plan-mensual')}
                disabled={loading === 'plan-mensual'}
                className="w-full bg-[#C8A46A] text-white py-3 rounded-lg font-semibold hover:bg-[#B8945A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === 'plan-mensual' ? 'Procesando...' : 'Suscribirme ahora'}
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-[#111111] text-center mb-8">Preguntas Frecuentes</h3>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-semibold text-[#111111] mb-2">Como funcionan las sugerencias?</h4>
              <p className="text-[#8E8E8E]">
                Basandonos en tu perfil (genero, complexion, estilos preferidos) y la ocasion que describes,
                nuestra IA genera outfits personalizados con imagenes de referencia y descripciones detalladas.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-semibold text-[#111111] mb-2">Puedo cancelar mi suscripcion?</h4>
              <p className="text-[#8E8E8E]">
                Si, puedes cancelar tu suscripcion en cualquier momento. Seguiras teniendo acceso hasta
                el final de tu periodo de facturacion actual.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-semibold text-[#111111] mb-2">Que metodos de pago aceptan?</h4>
              <p className="text-[#8E8E8E]">
                Aceptamos todas las tarjetas de credito y debito principales (Visa, Mastercard, American Express)
                a traves de nuestra plataforma segura de pagos Stripe.
              </p>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-[#8E8E8E] text-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Pagos seguros con Stripe</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#111111] text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-6">
              <a href="#" className="text-[#C8A46A] hover:text-[#B8945A] transition-colors">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-[#C8A46A] hover:text-[#B8945A] transition-colors">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-[#C8A46A] hover:text-[#B8945A] transition-colors">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>
            <p className="text-[#8E8E8E] text-sm">© 2024 Que Me Pongo? - Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LoadingPlanes() {
  return (
    <div className="min-h-screen bg-[#F6F4EF] flex items-center justify-center">
      <div className="text-[#C8A46A] text-xl">Cargando planes...</div>
    </div>
  );
}

export default function PlanesPage() {
  return (
    <Suspense fallback={<LoadingPlanes />}>
      <PlanesContent />
    </Suspense>
  );
}

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ExitoContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-[#111111] mb-4">
        Pago Exitoso!
      </h1>

      <p className="text-[#8E8E8E] text-lg mb-6">
        Gracias por tu compra{user ? `, ${user.name}` : ''}. Tu pago ha sido procesado correctamente.
      </p>

      <div className="bg-[#F6F4EF] rounded-xl p-6 mb-8">
        <div className="flex items-center justify-center gap-3 text-[#C8A46A]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold">Tu cuenta ha sido activada</span>
        </div>
        <p className="text-sm text-[#8E8E8E] mt-2">
          Ya puedes empezar a generar sugerencias de outfits personalizadas
        </p>
      </div>

      <div className="space-y-4">
        <Link
          href="/dashboard"
          className="block w-full bg-[#C8A46A] text-white py-3 rounded-lg font-semibold hover:bg-[#B8945A] transition-colors"
        >
          Ir al Dashboard
        </Link>

        <p className="text-sm text-[#8E8E8E]">
          Recibiras un email de confirmacion en breve
        </p>
      </div>

      {sessionId && (
        <p className="text-xs text-gray-400 mt-6">
          ID de transaccion: {sessionId.slice(0, 20)}...
        </p>
      )}
    </div>
  );
}

function LoadingContent() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
        <div className="w-10 h-10 bg-gray-200 rounded"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
    </div>
  );
}

export default function ExitoPage() {
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Suspense fallback={<LoadingContent />}>
          <ExitoContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-[#111111] text-white py-6 absolute bottom-0 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#8E8E8E] text-sm text-center">
            © 2024 Que Me Pongo? - Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulación de login - reemplazar con API real
    setTimeout(() => {
      if (email && password) {
        // Guardar sesión simulada
        localStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0] }));
        router.push('/dashboard');
      } else {
        setError('Por favor completa todos los campos');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="https://quemepongo.help" className="inline-block">
            <h1 className="text-3xl font-bold text-[#111111]">¿Qué Me Pongo?</h1>
          </Link>
          <p className="text-[#8E8E8E] mt-2">Inicia sesión en tu cuenta</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#111111] mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A46A] focus:border-transparent text-[#111111]"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#111111] mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A46A] focus:border-transparent text-[#111111]"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#C8A46A] border-gray-300 rounded focus:ring-[#C8A46A]"
                />
                <span className="ml-2 text-[#8E8E8E]">Recordarme</span>
              </label>
              <a href="#" className="text-[#C8A46A] hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8A46A] text-[#111111] py-3 rounded-lg font-semibold hover:bg-[#B8945A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#8E8E8E] text-sm">
              ¿No tienes cuenta?{' '}
              <Link href="/registro" className="text-[#C8A46A] font-semibold hover:underline">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="https://quemepongo.help" className="text-[#8E8E8E] text-sm hover:text-[#C8A46A]">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

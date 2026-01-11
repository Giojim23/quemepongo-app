'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegistroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    // Simulación de registro - reemplazar con API real
    setTimeout(() => {
      // Guardar usuario simulado
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        name: formData.name
      }));
      router.push('/dashboard');
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="https://quemepongo.help" className="inline-block">
            <h1 className="text-3xl font-bold text-[#111111]">¿Qué Me Pongo?</h1>
          </Link>
          <p className="text-[#8E8E8E] mt-2">Crea tu cuenta gratis</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#111111] mb-2">
                Nombre completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A46A] focus:border-transparent text-[#111111]"
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#111111] mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A46A] focus:border-transparent text-[#111111]"
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-[#8E8E8E] mt-1">Mínimo 6 caracteres</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#111111] mb-2">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A46A] focus:border-transparent text-[#111111]"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#C8A46A] border-gray-300 rounded focus:ring-[#C8A46A] mt-1"
                required
              />
              <label className="ml-2 text-sm text-[#8E8E8E]">
                Acepto los{' '}
                <a href="#" className="text-[#C8A46A] hover:underline">
                  términos y condiciones
                </a>
                {' '}y la{' '}
                <a href="#" className="text-[#C8A46A] hover:underline">
                  política de privacidad
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8A46A] text-[#111111] py-3 rounded-lg font-semibold hover:bg-[#B8945A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#8E8E8E] text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-[#C8A46A] font-semibold hover:underline">
                Inicia sesión
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

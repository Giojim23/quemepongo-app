'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Profile state
  const [gender, setGender] = useState('');
  const [build, setBuild] = useState('');
  const [styles, setStyles] = useState<string[]>([]);
  const [fit, setFit] = useState('');

  // Event state
  const [eventDescription, setEventDescription] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [weather, setWeather] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  // Generated outfits state
  const [generatedOutfits, setGeneratedOutfits] = useState<Array<{
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    photographer?: string;
  }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');

  const outfitImages = [
    { url: 'https://i.ibb.co/7Jb7JBrD/opciones-mujer3.png', label: 'Outfit Mujer' },
    { url: 'https://i.ibb.co/TBbpcqQ3/opciones-hombre3.png', label: 'Outfit Hombre' },
    { url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300', label: 'Mascota con Estilo' },
  ];

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userData));
      setLoading(false);
    }
  }, [router]);

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % outfitImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [outfitImages.length]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleStyleChange = (style: string, checked: boolean) => {
    if (checked) {
      setStyles([...styles, style]);
    } else {
      setStyles(styles.filter(s => s !== style));
    }
  };

  const handleGenerateOutfits = async () => {
    setIsGenerating(true);
    setGenerationError('');
    setGeneratedOutfits([]);

    try {
      // 1. Call Claude API to generate outfit descriptions
      const outfitsResponse = await fetch('/api/generate-outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: { gender, build, styles, fit },
          event: { description: eventDescription, timeOfDay, weather, location: eventLocation }
        })
      });

      if (!outfitsResponse.ok) {
        throw new Error('Error al generar outfits');
      }

      const { outfits } = await outfitsResponse.json();

      // 2. Search images for each outfit
      const outfitsWithImages = await Promise.all(
        outfits.map(async (outfit: { id: number; title: string; description: string; searchQuery: string }) => {
          try {
            const imgResponse = await fetch('/api/search-images', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: outfit.searchQuery })
            });
            const imageData = await imgResponse.json();
            return {
              id: outfit.id,
              title: outfit.title,
              description: outfit.description,
              imageUrl: imageData.imageUrl,
              photographer: imageData.photographer
            };
          } catch {
            return {
              id: outfit.id,
              title: outfit.title,
              description: outfit.description,
              imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
              photographer: 'Unsplash'
            };
          }
        })
      );

      setGeneratedOutfits(outfitsWithImages);
    } catch (error) {
      console.error('Error generating outfits:', error);
      setGenerationError('Hubo un error al generar los outfits. Por favor intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F4EF] flex items-center justify-center">
        <div className="text-[#C8A46A] text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4EF]">
      {/* Header */}
      <header className="bg-[#111111] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <img src="https://i.ibb.co/F4rv46Qk/quemepongo2.png" alt="¿Qué Me Pongo?" style={{ height: '130px', width: 'auto' }} />
            <div className="flex items-center gap-4">
              <span className="text-[#C8A46A] text-sm">Hola, {user?.name}!</span>
              <button
                onClick={handleLogout}
                className="bg-[#C8A46A] text-[#111111] px-4 py-2 rounded-lg font-semibold hover:bg-[#B8945A] transition-colors text-sm"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#111111] mb-4">
            Bienvenido a tu Panel de Control
          </h2>
          <p className="text-[#8E8E8E] text-lg">
            Aquí podrás gestionar tus outfits, preferencias y más.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#8E8E8E] text-sm font-medium">Outfits creados</p>
                <p className="text-3xl font-bold text-[#111111] mt-2">0</p>
              </div>
              <div className="bg-[#C8A46A] bg-opacity-10 p-3 rounded-lg">
                <svg className="w-8 h-8 text-[#C8A46A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#8E8E8E] text-sm font-medium">Favoritos</p>
                <p className="text-3xl font-bold text-[#111111] mt-2">0</p>
              </div>
              <div className="bg-[#C8A46A] bg-opacity-10 p-3 rounded-lg">
                <svg className="w-8 h-8 text-[#C8A46A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#8E8E8E] text-sm font-medium">Plan actual</p>
                <p className="text-xl font-bold text-[#111111] mt-2">Gratis</p>
              </div>
              <div className="bg-[#C8A46A] bg-opacity-10 p-3 rounded-lg">
                <svg className="w-8 h-8 text-[#C8A46A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-[#111111] mb-6">Acciones rápidas</h3>

          {/* Profile Completion Form */}
          <div className="mb-6 p-6 bg-gradient-to-br from-[#F6F4EF] to-[#F6F4EF] border-2 border-[#C8A46A] rounded-xl">
            <h4 className="text-lg font-semibold text-[#111111] mb-4">Cuéntanos de ti</h4>
            <div className="space-y-6">

              {/* Physical Attributes Section */}
              <div className="space-y-4">
                <h5 className="text-sm font-semibold text-[#C8A46A] uppercase tracking-wide">Características físicas</h5>

                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-2">
                    Género
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${gender === 'mujer' ? 'border-[#C8A46A] bg-[#C8A46A] bg-opacity-10' : 'border-gray-200 hover:border-[#C8A46A]'}`}>
                      <input type="radio" name="gender" value="mujer" checked={gender === 'mujer'} onChange={(e) => setGender(e.target.value)} className="w-4 h-4 text-[#C8A46A] border-gray-300 focus:ring-[#C8A46A]" />
                      <span className="text-sm font-medium text-[#111111]">Mujer</span>
                    </label>
                    <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${gender === 'hombre' ? 'border-[#C8A46A] bg-[#C8A46A] bg-opacity-10' : 'border-gray-200 hover:border-[#C8A46A]'}`}>
                      <input type="radio" name="gender" value="hombre" checked={gender === 'hombre'} onChange={(e) => setGender(e.target.value)} className="w-4 h-4 text-[#C8A46A] border-gray-300 focus:ring-[#C8A46A]" />
                      <span className="text-sm font-medium text-[#111111]">Hombre</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-2">
                    Complexión
                  </label>
                  <select value={build} onChange={(e) => setBuild(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#C8A46A] focus:outline-none bg-black text-[#C8A46A]">
                    <option value="">Selecciona...</option>
                    <option value="delgada">Delgada</option>
                    <option value="atletica">Atlética</option>
                    <option value="media">Media</option>
                    <option value="robusta">Robusta</option>
                  </select>
                </div>

              </div>

              {/* Style Preferences Section */}
              <div className="space-y-4">
                <h5 className="text-sm font-semibold text-[#C8A46A] uppercase tracking-wide">Preferencias de estilo</h5>

                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-2">
                    Estilos que te gustan (puedes seleccionar varios)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Clásica', 'Minimalista', 'En tendencia', 'Elegante', 'Casual', 'Deportivo', 'No lo sé aún'].map((styleOption) => (
                      <label key={styleOption} className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${styles.includes(styleOption) ? 'border-[#C8A46A] bg-[#C8A46A] bg-opacity-10' : 'border-gray-200 hover:border-[#C8A46A]'}`}>
                        <input type="checkbox" checked={styles.includes(styleOption)} onChange={(e) => handleStyleChange(styleOption, e.target.checked)} className="w-4 h-4 text-[#C8A46A] border-gray-300 rounded focus:ring-[#C8A46A]" />
                        <span className="text-sm text-[#111111]">{styleOption}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-2">
                    Preferencia de ajuste
                  </label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {[
                      { value: 'oversized', label: 'Oversized', desc: 'Muy holgada, tendencia actual' },
                      { value: 'semiformal', label: 'Semiformal', desc: 'Entre casual y formal' },
                      { value: 'estructurada', label: 'Estructurada', desc: 'Con forma definida' },
                      { value: 'fluida', label: 'Fluida', desc: 'Telas que caen suavemente' },
                      { value: 'al-cuerpo', label: 'Al cuerpo', desc: 'Ajustada y definida' }
                    ].map((fitOption) => (
                      <label key={fitOption.value} className={`flex items-start gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${fit === fitOption.value ? 'border-[#C8A46A] bg-[#C8A46A] bg-opacity-10' : 'border-gray-200 hover:border-[#C8A46A]'}`}>
                        <input type="radio" name="fit" value={fitOption.value} checked={fit === fitOption.value} onChange={(e) => setFit(e.target.value)} className="mt-1 w-4 h-4 text-[#C8A46A] border-gray-300 focus:ring-[#C8A46A]" />
                        <div>
                          <p className="text-sm font-medium text-[#111111]">{fitOption.label}</p>
                          <p className="text-xs text-[#8E8E8E]">{fitOption.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#C8A46A] text-white py-3 rounded-lg font-semibold hover:bg-[#B8945A] transition-colors">
                Guardar información del perfil
              </button>
            </div>
          </div>

          {/* Event Description Form */}
          <div className="mb-6 p-6 bg-gradient-to-br from-[#F6F4EF] to-[#F6F4EF] border-2 border-[#C8A46A] rounded-xl">
            <h4 className="text-lg font-semibold text-[#111111] mb-4">Cuéntanos sobre tu evento</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">
                  Describe tu evento
                </label>
                <textarea
                  placeholder="Ej: Cena de negocios, reunión casual, fiesta..."
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#C8A46A] focus:outline-none resize-none"
                  rows={2}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-2">
                    ¿Día o noche?
                  </label>
                  <select value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#C8A46A] focus:outline-none bg-black text-[#C8A46A]">
                    <option value="">Selecciona...</option>
                    <option value="dia">Día</option>
                    <option value="noche">Noche</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-2">
                    Clima estimado
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 25°C"
                    value={weather}
                    onChange={(e) => setWeather(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#C8A46A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-2">
                    Lugar del evento
                  </label>
                  <select value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#C8A46A] focus:outline-none bg-black text-[#C8A46A]">
                    <option value="">Selecciona...</option>
                    <option value="interior">Interior</option>
                    <option value="exterior">Exterior</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateOutfits}
                disabled={isGenerating}
                className="w-full bg-[#C8A46A] text-white py-3 rounded-lg font-semibold hover:bg-[#B8945A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generando outfits...' : 'Generar sugerencia de outfit'}
              </button>
            </div>
          </div>

          {/* Favorite Garment Upload */}
          <div className="mb-6 p-6 bg-gradient-to-br from-[#F6F4EF] to-[#F6F4EF] border-2 border-[#C8A46A] rounded-xl">
            <h4 className="text-lg font-semibold text-[#111111] mb-2">¿Tienes una prenda favorita?</h4>
            <p className="text-sm text-[#8E8E8E] mb-4">Sube una foto de una prenda y te sugerimos outfits que combinen con ella</p>
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:border-[#C8A46A] hover:bg-[#F6F4EF] transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-12 h-12 text-[#C8A46A] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm text-[#8E8E8E]">Arrastra una foto o haz clic para seleccionar</p>
              </div>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>

          {/* Outfit Examples Carousel */}
          <div className="mb-6 p-6 bg-gradient-to-br from-[#F6F4EF] to-[#F6F4EF] border-2 border-[#C8A46A] rounded-xl">
            <h4 className="text-lg font-semibold text-[#111111] mb-4">Ejemplos de outfits</h4>
            <div className="relative overflow-hidden rounded-xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {outfitImages.map((image, index) => (
                  <div key={index} className="min-w-full flex justify-center">
                    <div className="relative">
                      <img
                        src={image.url}
                        alt={image.label}
                        className="h-64 w-auto object-cover rounded-lg shadow-md"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2 rounded-b-lg">
                        <span className="text-sm font-medium">{image.label}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {outfitImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      currentSlide === index ? 'bg-[#C8A46A]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <button className="flex items-center gap-4 p-6 border-2 border-[#C8A46A] rounded-xl hover:bg-[#C8A46A] hover:bg-opacity-5 transition-all group">
              <div className="bg-[#C8A46A] p-3 rounded-lg group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-[#111111]">Crear nuevo outfit</p>
                <p className="text-sm text-[#8E8E8E]">Genera tu siguiente look perfecto</p>
              </div>
            </button>

            <button className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-[#C8A46A] hover:bg-[#C8A46A] hover:bg-opacity-5 transition-all group">
              <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-[#C8A46A] group-hover:bg-opacity-10 transition-colors">
                <svg className="w-6 h-6 text-[#8E8E8E] group-hover:text-[#C8A46A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-[#111111]">Mi guardarropa</p>
                <p className="text-sm text-[#8E8E8E]">Gestiona tus prendas</p>
              </div>
            </button>

            <button className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-[#C8A46A] hover:bg-[#C8A46A] hover:bg-opacity-5 transition-all group">
              <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-[#C8A46A] group-hover:bg-opacity-10 transition-colors">
                <svg className="w-6 h-6 text-[#8E8E8E] group-hover:text-[#C8A46A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-[#111111]">Configuración</p>
                <p className="text-sm text-[#8E8E8E]">Ajusta tus preferencias</p>
              </div>
            </button>
          </div>
        </div>

        {/* Generated Outfit Suggestions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-[#111111]">Outfits sugeridos para ti</h3>
              <p className="text-[#8E8E8E] mt-1">Basados en tu perfil y el evento descrito</p>
            </div>
            <button
              onClick={handleGenerateOutfits}
              disabled={isGenerating}
              className="bg-[#C8A46A] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#B8945A] transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'Generando...' : 'Generar nuevos'}
            </button>
          </div>

          {/* Error message */}
          {generationError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {generationError}
            </div>
          )}

          {/* Loading state */}
          {isGenerating && (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-xl bg-[#F6F4EF] border-2 border-gray-200">
                  <div className="aspect-[3/4] bg-gray-200"></div>
                  <div className="p-4 bg-white">
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Generated outfits */}
          {!isGenerating && generatedOutfits.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              {generatedOutfits.map((outfit) => (
                <div key={outfit.id} className="group relative overflow-hidden rounded-xl bg-[#F6F4EF] border-2 border-gray-200 hover:border-[#C8A46A] transition-all cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={outfit.imageUrl}
                      alt={outfit.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 bg-white">
                    <h4 className="font-semibold text-[#111111] mb-2">Opción {outfit.id}: {outfit.title}</h4>
                    <p className="text-sm text-[#8E8E8E] mb-3">{outfit.description}</p>
                    {outfit.photographer && (
                      <p className="text-xs text-gray-400">Foto: {outfit.photographer}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isGenerating && generatedOutfits.length === 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Elegante', desc: 'Perfecto para eventos formales' },
                { title: 'Casual Chic', desc: 'Ideal para eventos informales' },
                { title: 'Minimalista', desc: 'Estilo limpio y moderno' }
              ].map((placeholder, i) => (
                <div key={i} className="group relative overflow-hidden rounded-xl bg-[#F6F4EF] border-2 border-gray-200 hover:border-[#C8A46A] transition-all cursor-pointer">
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center p-6">
                      <svg className="w-16 h-16 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-500">Outfit {placeholder.title}</p>
                      <p className="text-xs text-gray-400 mt-1">Completa el formulario y genera</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <h4 className="font-semibold text-[#111111] mb-2">Opción {i + 1}: {placeholder.title}</h4>
                    <p className="text-sm text-[#8E8E8E] mb-3">{placeholder.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-[#F6F4EF] rounded-lg border-2 border-dashed border-[#C8A46A]">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#C8A46A] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-[#111111]">Analizamos tu perfil y el evento que describiste para buscar outfits similares en Pinterest y bases de datos de moda que se ajusten perfectamente a ti.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Banner */}
        <div className="mt-8 bg-gradient-to-r from-[#C8A46A] to-[#B8945A] rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Mejora a Premium</h3>
          <p className="text-white text-opacity-90 mb-6">
            Obtén sugerencias ilimitadas por solo $7.90/mes
          </p>
          <Link href="/planes" className="inline-block bg-white text-[#111111] px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all">
            Ver planes
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#111111] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-6">
              {/* Instagram */}
              <a href="#" className="text-[#C8A46A] hover:text-[#B8945A] transition-colors">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" className="text-[#C8A46A] hover:text-[#B8945A] transition-colors">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* TikTok */}
              <a href="#" className="text-[#C8A46A] hover:text-[#B8945A] transition-colors">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>
            <p className="text-[#8E8E8E] text-sm">© 2024 ¿Qué Me Pongo? - Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client"
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen flex justify-center items-center bg-gray-100">
      {/* Imagem de fundo fixa no canto inferior direito */}
      <div className="z-30 absolute bottom-0 right-0 w-full h-full bg-no-repeat bg-contain" style={{ backgroundImage: "url('/images/pet-background.webp')" }}></div>
      
      {/* Botão iniciar */}
      <button
        onClick={() => router.push('/dashboard')}
        className="z-40 px-6 py-3 w-40 h-20 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Iniciar
      </button>
    </div>
  );
}

"use client"
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative w-full h-30 flex justify-center items-center bg-gray-100">
      
      <button
        onClick={() => router.push('/dashboard')}
        className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition relative z-10"
      >
        Iniciar
      </button>
    </div>
  );
}

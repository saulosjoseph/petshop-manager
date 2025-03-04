'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const isDashboard = pathname === '/dashboard';

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/dashboard">Petshop Manager</Link>
        </h1>
        <div className="flex items-center space-x-4">
          {!isDashboard && (
            <button
              onClick={handleBack}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
            >
              Voltar
            </button>
          )}
          <Link
            href="/services/new"
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
          >
            Novo Serviço
          </Link>
          <Link
            href="/pets/new"
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
          >
            Novo Pet
          </Link>
        </div>
      </div>
    </header>
  );
}
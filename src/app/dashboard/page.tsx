'use client';

import { useEffect, useState } from 'react';
import { Service } from '@/types';
import Link from 'next/link';

export default function Dashboard() {
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    fetching: 0,
    in_progress: 0,
    returning: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        if (!res.ok) throw new Error('Erro ao carregar serviços');
        const services: Service[] = await res.json();
        const counts = services.reduce(
          (acc, service) => {
            acc[service.status] = (acc[service.status] || 0) + 1;
            return acc;
          },
          { pending: 0, fetching: 0, in_progress: 0, returning: 0, completed: 0 }
        );
        setStatusCounts(counts);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Erro desconhecido');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <div className="text-center p-4">Carregando...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Resumo de Serviços</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Pendente</h3>
          <p className="text-2xl">{statusCounts.pending}</p>
          <Link
            href="/services/by-status/pending"
            className="mt-2 inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Ver Detalhes
          </Link>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Buscar Animal</h3>
          <p className="text-2xl">{statusCounts.fetching}</p>
          <Link
            href="/services/by-status/fetching"
            className="mt-2 inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Ver Detalhes
          </Link>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Em Andamento</h3>
          <p className="text-2xl">{statusCounts.in_progress}</p>
          <Link
            href="/services/by-status/in_progress"
            className="mt-2 inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Ver Detalhes
          </Link>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Devolvendo</h3>
          <p className="text-2xl">{statusCounts.returning}</p>
          <Link
            href="/services/by-status/returning"
            className="mt-2 inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Ver Detalhes
          </Link>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Concluído</h3>
          <p className="text-2xl">{statusCounts.completed}</p>
          <Link
            href="/services/by-status/completed"
            className="mt-2 inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Ver Detalhes
          </Link>
        </div>
      </div>
    </div>
  );
}
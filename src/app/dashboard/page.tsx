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

  const statusLabels = {
    pending: 'Pendente',
    fetching: 'Buscar Animal',
    in_progress: 'Em Atendimento',
    returning: 'Devolvendo',
    completed: 'Concluído',
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Resumo de Serviços</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Link
            key={status}
            href={`/services/by-status/${status}`}
            className="p-4 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:bg-gray-100"
          >
            <h3 className="text-lg font-semibold">{statusLabels[status as keyof typeof statusLabels]}</h3>
            <p className="text-2xl">{count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

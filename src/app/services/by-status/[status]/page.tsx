'use client';

import { useEffect, useState } from 'react';
import { Service } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ServicesByStatus() {
  const { status } = useParams();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleOpenMap = (service: Service) => {
    const addressParts = [
      service.street,
      service.number,
      service.cep && `CEP: ${service.cep}`
    ].filter(Boolean).join(', ');

    if (!addressParts) {
      alert('Endereço incompleto para visualização no mapa');
      return;
    }

    const encodedAddress = encodeURIComponent(addressParts);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        if (!res.ok) throw new Error('Erro ao carregar serviços');
        const data: Service[] = await res.json();
        const filteredServices = data.filter((service) => service.status === status);
        setServices(filteredServices);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [status]);

  const handleUpdateStatus = async (serviceId: string) => {
    try {
      const res = await fetch('/api/services/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: serviceId }),
      });
      
      if (!res.ok) throw new Error('Erro ao atualizar status');
      const updatedService = await res.json();

      // Redireciona para a página do novo status
      router.push(`/services/by-status/${updatedService.service.status}`);
      
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center p-4">Carregando...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Serviços - {status?.toString().replace('_', ' ')}</h2>
      {services.length === 0 ? (
        <p className="text-gray-500">Nenhum serviço neste status.</p>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => {
            return (
              <div key={service._id} className="p-4 border rounded shadow-sm bg-white">
                <p>
                  <strong>Tipo(s):</strong>{' '}
                  {Array.isArray(service.type) ? service.type.join(', ') : service.type || 'Não especificado'}
                </p>
                <p>
                  <strong>Status:</strong> {service.status}
                </p>
                <p>
                  <strong>Data Agendada:</strong> {new Date(service.scheduledDate).toLocaleDateString('pt-BR')}
                </p>
                <p>
                  <strong>Pet:</strong> {service.pet.name} ({service.pet.species})
                </p>
                <p>
                  <strong>Tutor:</strong> {service.pet.ownerName}
                </p>
                <p>
                  <strong>Táxi:</strong> {service.taxi !== undefined ? (service.taxi ? 'Sim' : 'Não') : 'Não especificado'}
                </p>
                {service.taxi && service.street && service.number && (
                  <button
                    onClick={() => handleOpenMap(service)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mt-2"
                  >
                    Ver no mapa
                  </button>
                )}
                {service.notes && (
                  <p>
                    <strong>Notas:</strong> {service.notes}
                  </p>
                )}
                <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(service._id!)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Atualizar o Status
                    </button>
                  <Link
                    href={`/services/${service._id}/edit`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar Serviço
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { Service } from '@/types';
import { useParams, useRouter } from 'next/navigation';

export default function EditService() {
  const { serviceId } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ type: [] as string[], scheduledDate: '', taxi: false, notes: '' });
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch('/api/services');
        if (!res.ok) throw new Error('Erro ao carregar serviços');
        const data: Service[] = await res.json();
        const foundService = data.find((s) => s._id === serviceId);
        if (!foundService) throw new Error('Serviço não encontrado');
        setService(foundService);
        setForm({
          type: Array.isArray(foundService.type) ? foundService.type : [foundService.type],
          scheduledDate: new Date(foundService.scheduledDate).toISOString().slice(0, 16),
          taxi: foundService.taxi || false,
          notes: foundService.notes || '',
        });
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
    fetchService();
  }, [serviceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: serviceId,
          type: form.type,
          scheduledDate: new Date(form.scheduledDate),
          taxi: form.taxi,
          notes: form.notes,
        }),
      });
      if (!res.ok) throw new Error('Erro ao atualizar serviço');
      setSuccess('Serviço atualizado com sucesso!');
      setTimeout(() => router.push(`/services/by-status/${service?.status}`), 1000);
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

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setForm({ ...form, type: selectedOptions });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  if (loading && !service) return <div className="text-center p-4">Carregando...</div>;
  if (error && !service) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Editar Serviço</h2>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg">
        <p><strong>Pet:</strong> {service?.pet.name} ({service?.pet.species})</p>
        <p><strong>Tutor:</strong> {service?.pet.ownerName}</p>
        <p><strong>Status:</strong> {service?.status}</p>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Serviço</label>
              <select
                name="type"
                multiple
                value={form.type}
                onChange={handleTypeChange}
                className="mt-1 p-2 w-full border rounded h-24"
              >
                <option value="bath">Banho</option>
                <option value="grooming">Tosa</option>
                <option value="vet">Consulta Veterinária</option>
                <option value="boarding">Hospedagem</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Segure Ctrl (ou Cmd) para selecionar múltiplos</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data Agendada</label>
              <input
                type="datetime-local"
                name="scheduledDate"
                value={form.scheduledDate}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  name="taxi"
                  checked={form.taxi}
                  onChange={handleChange}
                  className="mr-2"
                />
                Necessita de Táxi
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Observações</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
                rows={3}
              />
            </div>
          </div>
          {error && <p className="mt-2 text-red-500">{error}</p>}
          {success && <p className="mt-2 text-green-500">{success}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full p-2 rounded text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  );
}
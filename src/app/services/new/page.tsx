'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Pet } from '@/types';

export default function NewServicePage() {
  const [form, setForm] = useState({
    petId: '',
    type: [] as string[],
    scheduledDate: '',
    taxi: false,
    cep: '',
    street: '',
    number: '',
    notes: '',
  });
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Fetch pets para o select
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch('/api/pets');
        if (!res.ok) throw new Error('Erro ao carregar pets');
        const data = await res.json();
        setPets(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchPets();
  }, []);

  // Busca endereço pelo CEP
  const fetchAddressByCep = async (cep: string) => {
    if (!cep || cep.length < 8) return;
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
      if (!res.ok) throw new Error('Erro ao buscar endereço');
      const data = await res.json();
      setForm((prev) => ({
        ...prev,
        street: `${data.street}, ${data.neighborhood}, ${data.city} - ${data.state}`,
      }));
    } catch (err: any) {
      setError('CEP inválido ou não encontrado');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (form.type.length === 0) {
      setError('Selecione pelo menos um tipo de serviço');
      setLoading(false);
      return;
    }

    if (form.taxi && (!form.cep || !form.street || !form.number)) {
      setError('Preencha todos os campos de endereço para serviços com táxi');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pet: form.petId,
          type: form.type,
          scheduledDate: new Date(form.scheduledDate),
          taxi: form.taxi,
          ...(form.taxi && {
            cep: form.cep,
            street: form.street,
            number: form.number,
          }), // Inclui campos de endereço apenas se taxi for true
          notes: form.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar serviço');

      setSuccess('Serviço cadastrado com sucesso!');
      setForm({
        petId: '',
        type: [],
        scheduledDate: '',
        taxi: false,
        cep: '',
        street: '',
        number: '',
        notes: '',
      });
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setForm({ ...form, type: selectedOptions });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
      if (name === 'cep' && value.length === 8) {
        fetchAddressByCep(value);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Cadastrar Novo Serviço</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg">
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Pet</label>
            <select
              name="petId"
              value={form.petId}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            >
              <option value="">Selecione um pet</option>
              {pets.map((pet) => (
                <option key={pet._id} value={pet._id}>
                  {pet.name} ({pet.species}) - {pet.ownerName}
                </option>
              ))}
            </select>
          </div>
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
          {form.taxi && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">CEP</label>
                <input
                  type="text"
                  name="cep"
                  value={form.cep}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                  maxLength={8}
                  required={form.taxi}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Endereço</label>
                <input
                  type="text"
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                  required={form.taxi}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Número</label>
                <input
                  type="text"
                  name="number"
                  value={form.number}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                  required={form.taxi}
                />
              </div>
            </>
          )}
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
          {loading ? 'Cadastrando...' : 'Cadastrar Serviço'}
        </button>
      </form>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPetPage() {
  const [form, setForm] = useState({
    name: '',
    species: '',
    ownerName: '',
    contactNumber: '',
    address: '',
    birthDate: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          birthDate: form.birthDate ? new Date(form.birthDate) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar pet');

      setSuccess('Pet cadastrado com sucesso!');
      setForm({ name: '', species: '', ownerName: '', contactNumber: '', address: '', birthDate: '', notes: '' });
      setTimeout(() => router.push('/dashboard'), 1000); // Redireciona após 1s
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Cadastrar Novo Pet</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg">
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Espécie</label>
            <input
              type="text"
              name="species"
              value={form.species}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Tutor</label>
            <input
              type="text"
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="text"
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Endereço</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
            />
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
          {loading ? 'Cadastrando...' : 'Cadastrar Pet'}
        </button>
      </form>
    </div>
  );
}
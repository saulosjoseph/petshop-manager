'use client';
import Groq from "groq-sdk";
import { useState } from "react";

export default function VetAnamnesisForm() {
    const groq = new Groq({ apiKey: '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', dangerouslyAllowBrowser: true });

    const [formData, setFormData] = useState({
        ownerName: "",
        ownerContact: "",
        petName: "",
        species: "",
        breed: "",
        age: "",
        weight: "",
        reasonForVisit: "",
        medicalHistory: "",
        currentMedications: "",
        observations: "",
    });

    const [prescription, setPrescription] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPrescription("Gerando prescrição. Aguarde um momento...");
        console.log("Formulário enviado:", formData);

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `Você é um(a) veterinário(a) experiente e recebeu um formulário de anamnese preenchido por um tutor de animal de estimação. Com base nas informações fornecidas, seu objetivo é:
Identificar possíveis condições de saúde que o animal pode ter, considerando os sintomas e histórico informados. Sugerir exames complementares que podem ser necessários para confirmar o diagnóstico. Fornecer orientações iniciais ao tutor, como cuidados paliativos até a consulta presencial. Importante: Seja claro e objetivo na análise. Caso os sintomas sejam vagos ou inconclusivos, destaque a necessidade de uma avaliação clínica detalhada. Não forneça um diagnóstico definitivo, apenas possibilidades baseadas nas informações fornecidas:
          ${JSON.stringify(formData, null, 2)}. `,
                },
            ],
            model: "llama-3.3-70b-versatile",
        });
        setPrescription(completion.choices[0]?.message?.content || "");
    };

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Formulário de Anamnese Veterinária</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="ownerName" placeholder="Nome do Tutor" value={formData.ownerName} onChange={handleChange} required className="w-full p-2 border rounded" />
                <input name="ownerContact" placeholder="Contato" value={formData.ownerContact} onChange={handleChange} required className="w-full p-2 border rounded" />
                <input name="petName" placeholder="Nome do Animal" value={formData.petName} onChange={handleChange} required className="w-full p-2 border rounded" />
                <input name="species" placeholder="Espécie" value={formData.species} onChange={handleChange} required className="w-full p-2 border rounded" />
                <input name="breed" placeholder="Raça" value={formData.breed} onChange={handleChange} className="w-full p-2 border rounded" />
                <input name="age" placeholder="Idade" value={formData.age} onChange={handleChange} className="w-full p-2 border rounded" />
                <input name="weight" placeholder="Peso (kg)" value={formData.weight} onChange={handleChange} className="w-full p-2 border rounded" />
                <textarea name="reasonForVisit" placeholder="Motivo da Consulta" value={formData.reasonForVisit} onChange={handleChange} required className="w-full p-2 border rounded" />
                <textarea name="medicalHistory" placeholder="Histórico Médico" value={formData.medicalHistory} onChange={handleChange} className="w-full p-2 border rounded" />
                <textarea name="currentMedications" placeholder="Medicações Atuais" value={formData.currentMedications} onChange={handleChange} className="w-full p-2 border rounded" />
                <textarea name="observations" placeholder="Observações Adicionais" value={formData.observations} onChange={handleChange} className="w-full p-2 border rounded" />
                <button disabled={prescription.length > 0} type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Gerar prescrição</button>
            </form>
            {prescription && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                    <h3 className="text-lg font-semibold">Prescrição Médica</h3>
                    <p className="mt-2 whitespace-pre-line">{prescription}</p>
                </div>
            )}
        </div>
    );
}

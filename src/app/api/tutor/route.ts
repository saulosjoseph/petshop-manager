import dbConnect from '@/lib/db';
import Tutor from '@/models/Tutor';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const tutorData = await req.json();
    
    // Validação básica
    const requiredFields = ['name', 'contactNumber'];
    for (const field of requiredFields) {
      if (!tutorData[field]) {
        return NextResponse.json({ error: `Campo ${field} é obrigatório` }, { status: 400 });
      }
    }

    const tutor = await Tutor.create(tutorData);
    return NextResponse.json({ message: 'Tutor cadastrado com sucesso', tutor }, { status: 201 });
  } catch (error: unknown) {
    console.log(error);
    const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar tutor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();

  try {
    const pets = await Tutor.find({});
    return NextResponse.json(pets);
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json({ error: 'Erro ao listar tutores' }, { status: 500 });
  }
}
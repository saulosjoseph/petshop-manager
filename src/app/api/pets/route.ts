import dbConnect from '@/lib/db';
import Pet from '@/models/Pet';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const petData = await req.json();
    
    // Validação básica
    const requiredFields = ['name', 'species', 'ownerName', 'contactNumber', 'address'];
    for (const field of requiredFields) {
      if (!petData[field]) {
        return NextResponse.json({ error: `Campo ${field} é obrigatório` }, { status: 400 });
      }
    }

    const pet = await Pet.create(petData);
    return NextResponse.json({ message: 'Pet cadastrado com sucesso', pet }, { status: 201 });
  } catch (error: unknown) {
    console.log(error);
    const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar pet';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();

  try {
    const pets = await Pet.find({});
    return NextResponse.json(pets);
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json({ error: 'Erro ao listar pets' }, { status: 500 });
  }
}
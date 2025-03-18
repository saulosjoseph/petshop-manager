export const maxDuration = 60;
import dbConnect from '@/lib/db';
import Service from '@/models/Service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const serviceData = await req.json();

    const requiredFields = ['pet', 'type', 'scheduledDate'];
    for (const field of requiredFields) {
      if (!serviceData[field]) {
        return NextResponse.json({ error: `Campo ${field} é obrigatório` }, { status: 400 });
      }
    }

    if (!Array.isArray(serviceData.type) || serviceData.type.length === 0) {
      return NextResponse.json({ error: 'Type deve ser um array não vazio' }, { status: 400 });
    }

    const validTypes = ['bath', 'grooming', 'vet', 'boarding'];
    for (const type of serviceData.type) {
      if (!validTypes.includes(type)) {
        return NextResponse.json({ error: `Tipo de serviço inválido: ${type}` }, { status: 400 });
      }
    }

    serviceData.taxi = typeof serviceData.taxi === 'boolean' ? serviceData.taxi : false;

    if (serviceData.taxi) {
      const taxiFields = ['street', 'number'];
      for (const field of taxiFields) {
        if (!serviceData[field]) {
          return NextResponse.json({ error: `Campo ${field} é obrigatório quando necessita de táxi` }, { status: 400 });
        }
      }
    }

    const service = await Service.create(serviceData);
    return NextResponse.json({ message: 'Serviço cadastrado com sucesso', service }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar serviço';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();

  try {
    const services = await Service.find({})
      .populate('pet', 'name species ownerName')
      .lean();
    return NextResponse.json(services);
  } catch(err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log('Erro desconhecido');
    }
    return NextResponse.json({ error: 'Erro ao listar serviços' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  await dbConnect();

  try {
    const { id, updateStatus, ...updates } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID do serviço é obrigatório' }, { status: 400 });
    }

    const service = await Service.findById(id);
    if (!service) {
      return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 });
    }

    if (updateStatus) {
      const getNextStatus = (currentStatus: string, needsTaxi: boolean): string | null => {
        if (!needsTaxi) {
          switch (currentStatus) {
            case 'pending':
              return 'in_progress';
            case 'in_progress':
              return 'completed';
            case 'completed':
              return null;
            default:
              return null;
          }
        } else {
          switch (currentStatus) {
            case 'pending':
              return 'fetching';
            case 'fetching':
              return 'in_progress';
            case 'in_progress':
              return 'returning';
            case 'returning':
              return 'completed';
            case 'completed':
              return null;
            default:
              return null;
          }
        }
      };

      const nextStatus = getNextStatus(service.status, service.taxi);
      if (!nextStatus) {
        return NextResponse.json({ error: 'Não há próximo status disponível' }, { status: 400 });
      }

      service.status = nextStatus;
    } else {
      if (updates.type) {
        if (!Array.isArray(updates.type) || updates.type.length === 0) {
          return NextResponse.json({ error: 'Type deve ser um array não vazio' }, { status: 400 });
        }
        const validTypes = ['bath', 'grooming', 'vet', 'boarding'];
        for (const type of updates.type) {
          if (!validTypes.includes(type)) {
            return NextResponse.json({ error: `Tipo de serviço inválido: ${type}` }, { status: 400 });
          }
        }
      }

      if ('taxi' in updates && typeof updates.taxi !== 'boolean') {
        return NextResponse.json({ error: 'Taxi deve ser um valor booleano' }, { status: 400 });
      }

      if (updates.taxi) {
        const taxiFields = ['street', 'number'];
        for (const field of taxiFields) {
          if (!updates[field]) {
            return NextResponse.json({ error: `Campo ${field} é obrigatório quando necessita de táxi` }, { status: 400 });
          }
        }
      }

      Object.assign(service, updates);
    }

    const updatedService = await service.save();
    await updatedService.populate('pet', 'name species ownerName');
    return NextResponse.json({ message: 'Serviço atualizado com sucesso', service: updatedService });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar serviço';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
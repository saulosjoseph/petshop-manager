import dbConnect from '@/lib/db';
import Pet from '@/models/Pet'; // Importar Pet explicitamente
import Service from '@/models/Service';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
    await dbConnect();

    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'ID do serviço é obrigatório' }, { status: 400 });
        }

        const service = await Service.findById(id);
        if (!service) {
            return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 });
        }

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

        const updatedService = await service.save();
        await updatedService.populate('pet', 'name species ownerName');
        return NextResponse.json({ message: 'Serviço atualizado com sucesso', service: updatedService });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Erro ao atualizar serviço' }, { status: 500 });
    }
}
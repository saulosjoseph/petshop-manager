const statusLabels: Record<string, string> = {
    pending: "Pendente",
    fetching: "Buscando",
    in_progress: "Em andamento",
    completed: "Concluído",
    returning: "Retornando",
};

export function getStatusLabel(value: string): string {
    return statusLabels[value] || "Desconhecido";
}
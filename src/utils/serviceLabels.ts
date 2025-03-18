const serviceLabels: Record<string, string> = {
    bath: "Banho",
    grooming: "Tosa",
    vet: "Consulta Veterinária",
    boarding: "Hospedagem",
  };
  
  export function getServiceLabel(value: string): string {
    return serviceLabels[value] || "Desconhecido";
  }
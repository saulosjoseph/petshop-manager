export interface Pet {
    _id?: string;
    name: string;
    species: string;
    ownerName: string;
    contactNumber: string;
    address: string;
    birthDate?: Date;
    notes?: string;
  }
  
  export interface Service {
    _id?: string;
    pet: Pet;
    type: ('bath' | 'grooming' | 'vet' | 'boarding')[]; // Array de tipos
    status: 'pending' | 'fetching' | 'in_progress' | 'completed' | 'returning';
    scheduledDate: Date;
    cep?: string;
    street?: string;
    number?: string;
    taxi: boolean; // Novo campo
    notes?: string;
    assignedTo?: { _id: string; name: string; email: string };
  }
  
  export interface User {
    _id?: string;
    email: string;
    name: string;
    role: 'admin' | 'employee';
  }
export interface Patient {
  id: string;
  name: string;
  age: number;
  village: string;
  symptoms: string;
  token: string;
  status: 'WAITING' | 'SERVING' | 'COMPLETED';
  createdAt: string;
}

export interface Medicine {
  id: string;
  medicineName: string;
  expiryDate: string;
  stock: number;
  createdAt: string;
}

export interface AIResponse {
  advice?: string;
  error?: string;
  instructions?: string;
}

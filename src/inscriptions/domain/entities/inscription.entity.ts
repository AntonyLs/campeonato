export interface RegisteredTeam {
  id: number;
  nombre: string;
  categoria: string | null;
  userId: number;
}

export interface Inscription {
  id: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  dni: string;
  celular: string;
  email: string;
  team: RegisteredTeam | null;
}

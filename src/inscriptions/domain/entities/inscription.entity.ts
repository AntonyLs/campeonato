export interface RegisteredTeam {
  id: number;
  nombre: string;
  userId: number;
  categoryId: number | null;
  professionalCollegeId: number | null;
  category?: {
    id: number;
    nombre: string;
  } | null;
  professionalCollege?: {
    id: number;
    nombre: string;
  } | null;
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

export interface InscriptionContinuationAccess {
  token: string;
  link: string;
  expiresAt: Date | null;
}

export interface CreatedInscriptionResult {
  inscription: Inscription;
  continuationAccess: InscriptionContinuationAccess;
}

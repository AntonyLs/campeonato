import { Inscription } from '../entities/inscription.entity';

export interface CreateInscriptionData {
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  dni: string;
  celular: string;
  email: string;
  nombre_equipo: string;
  categoriaId?: number;
  colegioProfesionalId?: number;
}

export type UpdateInscriptionData = Partial<CreateInscriptionData>;

export abstract class InscriptionsRepository {
  abstract findAll(): Promise<Inscription[]>;
  abstract findOne(id: number): Promise<Inscription>;
  abstract create(data: CreateInscriptionData): Promise<Inscription>;
  abstract update(
    id: number,
    data: UpdateInscriptionData,
  ): Promise<Inscription>;
}

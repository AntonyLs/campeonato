import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { handlePrismaError } from '../prisma/prisma-error.mapper';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const players = await this.prisma.player.findMany({
      include: {
        team: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    return players.map((player) => this.toPlayerWithOwnerResponse(player));
  }

  async findOne(id: number) {
    const player = await this.prisma.player.findUnique({
      where: {
        id,
      },
      include: {
        team: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!player) {
      throw new NotFoundException('No se encontro el jugador.');
    }

    return this.toPlayerWithOwnerResponse(player);
  }

  async findCarnet(id: number) {
    const player = await this.prisma.player.findUnique({
      where: {
        id,
      },
      include: {
        team: {
          include: {
            user: true,
            category: true,
            professionalCollege: true,
          },
        },
      },
    });

    if (!player) {
      throw new NotFoundException('No se encontro el jugador.');
    }

    return this.toPlayerCarnetResponse(player);
  }

  findByTeam(teamId: number) {
    return this.prisma.player.findMany({
      where: {
        teamId,
      },
      include: {
        team: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    }).then((players) =>
      players.map((player) => this.toPlayerWithOwnerResponse(player)),
    );
  }

  findByDelegateTeam(teamId: number) {
    return this.findByTeam(teamId);
  }

  async update(id: number, data: UpdatePlayerDto) {
    await this.ensurePlayerExists(id);

    if (data.dni !== undefined) {
      await this.ensurePlayerDniIsAvailable(data.dni, id);
    }

    try {
      const player = await this.prisma.player.update({
        where: {
          id,
        },
        data,
        include: {
          team: {
            include: {
              user: true,
            },
          },
        },
      });

      return this.toPlayerWithOwnerResponse(player);
    } catch (error) {
      handlePrismaError(error, 'jugador');
    }
  }

  async remove(id: number) {
    try {
      const player = await this.prisma.player.delete({
        where: {
          id,
        },
        include: {
          team: {
            include: {
              user: true,
            },
          },
        },
      });

      return this.toPlayerWithOwnerResponse(player);
    } catch (error) {
      handlePrismaError(error, 'jugador');
    }
  }

  async updateForDelegateTeam(
    teamId: number,
    id: number,
    data: UpdatePlayerDto,
  ) {
    await this.ensurePlayerBelongsToTeam(id, teamId);
    return this.update(id, data);
  }

  async removeForDelegateTeam(teamId: number, id: number) {
    await this.ensurePlayerBelongsToTeam(id, teamId);
    return this.remove(id);
  }

  async findCarnetForDelegateTeam(teamId: number, id: number) {
    await this.ensurePlayerBelongsToTeam(id, teamId);
    return this.findCarnet(id);
  }

  async createForUser(userId: number, data: CreatePlayerDto) {
    const team = await this.prisma.team.findUnique({
      where: {
        userId,
      },
    });

    if (!team) {
      throw new NotFoundException('El usuario no tiene equipos registrados.');
    }

    return this.createForUserTeam(userId, team.id, data);
  }

  async createForUserTeam(
    userId: number,
    teamId: number,
    data: CreatePlayerDto,
  ) {
    await this.ensurePlayerDniIsAvailable(data.dni);

    const team = await this.prisma.team.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      throw new NotFoundException('No se encontro el equipo.');
    }

    if (team.userId !== userId) {
      throw new ForbiddenException(
        'El equipo no pertenece a este usuario/delegado.',
      );
    }

    try {
      const player = await this.prisma.player.create({
        data: {
          nombres: data.nombres,
          apellido_paterno: data.apellido_paterno,
          apellido_materno: data.apellido_materno,
          dni: data.dni,
          nro_colegiatura: data.nro_colegiatura,
          edad: data.edad,
          foto_url: data.foto_url,
          teamId,
        },
        include: {
          team: {
            include: {
              user: true,
            },
          },
        },
      });

      return this.toPlayerWithOwnerResponse(player);
    } catch (error) {
      handlePrismaError(error, 'jugador');
    }
  }

  private async ensurePlayerExists(id: number) {
    const player = await this.prisma.player.findUnique({
      where: {
        id,
      },
    });

    if (!player) {
      throw new NotFoundException('No se encontro el jugador.');
    }
  }

  private async ensurePlayerBelongsToTeam(id: number, teamId: number) {
    const player = await this.prisma.player.findUnique({
      where: {
        id,
      },
    });

    if (!player) {
      throw new NotFoundException('No se encontro el jugador.');
    }

    if (player.teamId !== teamId) {
      throw new ForbiddenException(
        'El jugador no pertenece al equipo del delegado.',
      );
    }
  }

  private async ensurePlayerDniIsAvailable(
    dni: string,
    ignoredPlayerId?: number,
  ) {
    const existingPlayer = await this.prisma.player.findFirst({
      where: {
        dni,
        id:
          ignoredPlayerId === undefined
            ? undefined
            : {
                not: ignoredPlayerId,
              },
      },
      include: {
        team: true,
      },
    });

    if (existingPlayer) {
      throw new ConflictException(
        `Ya existe un jugador registrado con ese dni en el equipo ${existingPlayer.team.nombre} (id: ${existingPlayer.team.id}).`,
      );
    }
  }

  private toPlayerWithOwnerResponse(player: {
    id: number;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    dni: string;
    nro_colegiatura: string | null;
    edad: number | null;
    foto_url: string | null;
    teamId: number;
    team: {
      id: number;
      nombre: string;
      user: {
        id: number;
        nombres: string;
        apellido_paterno: string;
        apellido_materno: string;
      };
    };
  }) {
    return {
      id: player.id,
      nombres: player.nombres,
      apellido_paterno: player.apellido_paterno,
      apellido_materno: player.apellido_materno,
      dni: player.dni,
      nro_colegiatura: player.nro_colegiatura,
      edad: player.edad,
      foto_url: player.foto_url,
      teamId: player.teamId,
      team: {
        id: player.team.id,
        nombre: player.team.nombre,
      },
      delegado: {
        id: player.team.user.id,
        nombre: [
          player.team.user.nombres,
          player.team.user.apellido_paterno,
          player.team.user.apellido_materno,
        ].join(' '),
      },
    };
  }

  private toPlayerCarnetResponse(player: {
    id: number;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    dni: string;
    nro_colegiatura: string | null;
    edad: number | null;
    foto_url: string | null;
    teamId: number;
    team: {
      id: number;
      nombre: string;
      category: {
        id: number;
        nombre: string;
      } | null;
      professionalCollege: {
        id: number;
        nombre: string;
        abreviatura: string | null;
      } | null;
      user: {
        id: number;
        nombres: string;
        apellido_paterno: string;
        apellido_materno: string;
        dni: string;
        celular: string;
        email: string;
      };
    };
  }) {
    return {
      jugador: {
        id: player.id,
        nombres: player.nombres,
        apellido_paterno: player.apellido_paterno,
        apellido_materno: player.apellido_materno,
        dni: player.dni,
        nro_colegiatura: player.nro_colegiatura,
        edad: player.edad,
        foto_url: player.foto_url,
      },
      equipo: {
        id: player.team.id,
        nombre: player.team.nombre,
      },
      categoria: player.team.category,
      colegio_profesional: player.team.professionalCollege,
      delegado: {
        id: player.team.user.id,
        nombres: player.team.user.nombres,
        apellido_paterno: player.team.user.apellido_paterno,
        apellido_materno: player.team.user.apellido_materno,
        dni: player.team.user.dni,
        celular: player.team.user.celular,
        email: player.team.user.email,
      },
    };
  }
}

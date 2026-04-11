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

  findByTeam(teamId: number) {
    return this.prisma.player.findMany({
      where: {
        teamId,
      },
      orderBy: {
        id: 'asc',
      },
    });
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
          nombre: data.nombre,
          dni: data.dni,
          numero: data.numero,
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
    nombre: string;
    dni: string;
    numero: number | null;
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
      nombre: player.nombre,
      dni: player.dni,
      numero: player.numero,
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
}

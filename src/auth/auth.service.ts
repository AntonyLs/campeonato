import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  createSessionToken,
  SessionTokenPayload,
  verifySessionToken,
} from '../security/session-token.util';
import { verifyPassword } from '../security/hash.util';
import { AdminLoginDto } from './dto/admin-login.dto';
import { DelegateLoginDto } from './dto/delegate-login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async loginAdmin(data: AdminLoginDto) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        correo: data.correo,
      },
    });

    if (!admin || !verifyPassword(data.password, admin.password)) {
      throw new UnauthorizedException('Credenciales invalidas.');
    }

    const accessToken = createSessionToken(
      {
        sub: 'admin',
        entityId: admin.id,
      },
      60 * 60 * 8,
    );

    const { password, ...sanitizedAdmin } = admin;

    return {
      accessToken,
      admin: sanitizedAdmin,
    };
  }

  async loginDelegate(data: DelegateLoginDto) {
    const delegate = await this.prisma.user.findFirst({
      where: {
        email: data.email,
        dni: data.dni,
      },
      include: {
        team: {
          include: {
            category: true,
            professionalCollege: true,
            players: true,
          },
        },
      },
    });

    if (!delegate) {
      throw new UnauthorizedException('Datos de delegado invalidos.');
    }

    const accessToken = createSessionToken(
      {
        sub: 'delegate',
        entityId: delegate.id,
        teamId: delegate.team?.id,
      },
      60 * 60 * 8,
    );

    return {
      accessToken,
      inscription: delegate,
    };
  }

  async getCurrentAdmin(token: string) {
    const payload = this.verifyToken(token, 'admin');

    const admin = await this.prisma.admin.findUnique({
      where: {
        id: payload.entityId,
      },
    });

    if (!admin) {
      throw new NotFoundException('No se encontro el administrador.');
    }

    const { password, ...sanitizedAdmin } = admin;
    return sanitizedAdmin;
  }

  async getCurrentDelegate(token: string) {
    const payload = this.verifyToken(token, 'delegate');

    const delegate = await this.prisma.user.findUnique({
      where: {
        id: payload.entityId,
      },
      include: {
        team: {
          include: {
            category: true,
            professionalCollege: true,
            players: true,
          },
        },
      },
    });

    if (!delegate) {
      throw new NotFoundException('No se encontro el delegado.');
    }

    return delegate;
  }

  verifyToken(token: string, subject: SessionTokenPayload['sub']) {
    const payload = verifySessionToken(token);

    if (!payload || payload.sub !== subject) {
      throw new UnauthorizedException('Token invalido o expirado.');
    }

    return payload;
  }
}

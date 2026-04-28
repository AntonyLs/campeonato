import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  createSessionToken,
  SessionTokenPayload,
  verifySessionToken,
} from '../security/session-token.util';
import { verifyPassword } from '../security/hash.util';
import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async loginAdmin(data: AdminLoginDto) {
    if ((!data.correo && !data.dni) || !data.password) {
      throw new UnauthorizedException(
        'Debes enviar correo o dni junto con tu password.',
      );
    }

    const admin = await this.prisma.admin.findFirst({
      where: {
        OR: [
          data.correo ? { correo: data.correo } : undefined,
          data.dni ? { dni: data.dni } : undefined,
        ].filter(Boolean) as Array<{ correo?: string; dni?: string }>,
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

  verifyToken(token: string, subject: SessionTokenPayload['sub']) {
    const payload = verifySessionToken(token);

    if (!payload || payload.sub !== subject) {
      throw new UnauthorizedException('Token invalido o expirado.');
    }

    return payload;
  }
}

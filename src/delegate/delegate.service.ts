import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { CreatePlayerDto } from '../players/dto/create-player.dto';
import { UpdatePlayerDto } from '../players/dto/update-player.dto';
import { PlayersService } from '../players/players.service';
import { extractBearerToken } from '../security/session-token.util';
import { SupabaseStorageService } from '../storage/supabase-storage.service';
import { UpdateTeamDto } from '../teams/dto/update-team.dto';
import { TeamsService } from '../teams/teams.service';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class DelegateService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly teamsService: TeamsService,
    private readonly playersService: PlayersService,
    private readonly storageService: SupabaseStorageService,
  ) {}

  async getProfile(authorization?: string) {
    const payload = this.getDelegatePayload(authorization);
    return this.usersService.findOneWithTeam(payload.entityId);
  }

  async updateProfile(authorization: string | undefined, data: UpdateUserDto) {
    const payload = this.getDelegatePayload(authorization);
    return this.usersService.update(payload.entityId, data);
  }

  async getTeam(authorization?: string) {
    const payload = this.getDelegatePayload(authorization);
    return this.teamsService.findOneWithUser(this.getTeamId(payload));
  }

  async updateTeam(authorization: string | undefined, data: UpdateTeamDto) {
    const payload = this.getDelegatePayload(authorization);
    return this.teamsService.update(this.getTeamId(payload), data);
  }

  async findPlayers(authorization?: string) {
    const payload = this.getDelegatePayload(authorization);
    return this.playersService.findByDelegateTeam(this.getTeamId(payload));
  }

  async findPlayerCarnet(authorization: string | undefined, id: number) {
    const payload = this.getDelegatePayload(authorization);
    return this.playersService.findCarnetForDelegateTeam(
      this.getTeamId(payload),
      id,
    );
  }

  async createPlayer(authorization: string | undefined, data: CreatePlayerDto) {
    const payload = this.getDelegatePayload(authorization);

    return this.playersService.createForUser(payload.entityId, data);
  }

  async createPlayerWithPhoto(
    authorization: string | undefined,
    data: CreatePlayerDto,
    file?: {
      originalname: string;
      mimetype: string;
      size: number;
      buffer: Buffer;
    },
  ) {
    const payload = this.getDelegatePayload(authorization);

    if (file) {
      const upload = await this.storageService.uploadPlayerPhoto(file);
      data.foto_url = upload.publicUrl;
    }

    return this.playersService.createForUser(payload.entityId, data);
  }

  async updatePlayer(
    authorization: string | undefined,
    id: number,
    data: UpdatePlayerDto,
  ) {
    const payload = this.getDelegatePayload(authorization);
    return this.playersService.updateForDelegateTeam(
      this.getTeamId(payload),
      id,
      data,
    );
  }

  async updatePlayerWithPhoto(
    authorization: string | undefined,
    id: number,
    data: UpdatePlayerDto,
    file?: {
      originalname: string;
      mimetype: string;
      size: number;
      buffer: Buffer;
    },
  ) {
    const payload = this.getDelegatePayload(authorization);

    if (file) {
      const upload = await this.storageService.uploadPlayerPhoto(file);
      data.foto_url = upload.publicUrl;
    }

    return this.playersService.updateForDelegateTeam(
      this.getTeamId(payload),
      id,
      data,
    );
  }

  async removePlayer(authorization: string | undefined, id: number) {
    const payload = this.getDelegatePayload(authorization);
    return this.playersService.removeForDelegateTeam(this.getTeamId(payload), id);
  }

  private getDelegatePayload(authorization?: string) {
    const token = extractBearerToken(authorization);

    if (!token) {
      throw new UnauthorizedException(
        'Debes enviar un token Bearer valido.',
      );
    }

    return this.authService.verifyToken(token, 'delegate');
  }

  private getTeamId(payload: { teamId?: number }) {
    if (!payload.teamId) {
      throw new UnauthorizedException(
        'El delegado no tiene un equipo asociado en su sesion.',
      );
    }

    return payload.teamId;
  }
}

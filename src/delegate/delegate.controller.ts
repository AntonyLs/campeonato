import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UpdateTeamDto } from '../teams/dto/update-team.dto';
import { CreatePlayerDto } from '../players/dto/create-player.dto';
import { UpdatePlayerDto } from '../players/dto/update-player.dto';
import { DelegateService } from './delegate.service';

@Controller('delegate')
export class DelegateController {
  constructor(private readonly delegateService: DelegateService) {}

  @Get('me')
  getProfile(@Headers('authorization') authorization?: string) {
    return this.delegateService.getProfile(authorization);
  }

  @Patch('me')
  updateProfile(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: UpdateUserDto,
  ) {
    return this.delegateService.updateProfile(authorization, body);
  }

  @Get('team')
  getTeam(@Headers('authorization') authorization?: string) {
    return this.delegateService.getTeam(authorization);
  }

  @Patch('team')
  updateTeam(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: UpdateTeamDto,
  ) {
    return this.delegateService.updateTeam(authorization, body);
  }

  @Get('players')
  findPlayers(@Headers('authorization') authorization?: string) {
    return this.delegateService.findPlayers(authorization);
  }

  @Post('players')
  createPlayer(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: CreatePlayerDto,
  ) {
    return this.delegateService.createPlayer(authorization, body);
  }

  @Patch('players/:id')
  updatePlayer(
    @Headers('authorization') authorization: string | undefined,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePlayerDto,
  ) {
    return this.delegateService.updatePlayer(authorization, id, body);
  }

  @Delete('players/:id')
  removePlayer(
    @Headers('authorization') authorization: string | undefined,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.delegateService.removePlayer(authorization, id);
  }
}

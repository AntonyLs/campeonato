import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayersService } from './players.service';

@Controller()
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get('players')
  findAll() {
    return this.playersService.findAll();
  }

  @Get('players/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.findOne(id);
  }

  @Patch('players/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdatePlayerDto) {
    return this.playersService.update(id, body);
  }

  @Delete('players/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.remove(id);
  }

  @Get('teams/:teamId/players')
  findByTeam(@Param('teamId', ParseIntPipe) teamId: number) {
    return this.playersService.findByTeam(teamId);
  }

  @Post('users/:userId/players')
  createForUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: CreatePlayerDto,
  ) {
    return this.playersService.createForUser(userId, body);
  }

  @Post('users/:userId/teams/:teamId/players')
  createForUserTeam(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() body: CreatePlayerDto,
  ) {
    return this.playersService.createForUserTeam(userId, teamId, body);
  }
}

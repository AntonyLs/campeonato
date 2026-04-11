import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get('with-users')
  findAllWithUsers() {
    return this.teamsService.findAllWithUsers();
  }

  @Get(':id/with-user')
  findOneWithUser(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findOneWithUser(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTeamDto) {
    return this.teamsService.update(id, body);
  }
}

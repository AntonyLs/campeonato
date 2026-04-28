import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { InscriptionsService } from './inscriptions.service';
import { CreateInscriptionDto } from './application/dto/create-inscription.dto';
import { UpdateInscriptionDto } from './application/dto/update-inscription.dto';

@Controller('inscriptions')
export class InscriptionsController {
  constructor(private readonly inscriptionsService: InscriptionsService) {}

  @Get()
  findAll() {
    return this.inscriptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inscriptionsService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateInscriptionDto) {
    return this.inscriptionsService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateInscriptionDto,
  ) {
    return this.inscriptionsService.update(id, body);
  }
}

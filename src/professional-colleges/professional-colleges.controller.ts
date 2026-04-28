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
import { CreateProfessionalCollegeDto } from './dto/create-professional-college.dto';
import { UpdateProfessionalCollegeDto } from './dto/update-professional-college.dto';
import { ProfessionalCollegesService } from './professional-colleges.service';

@Controller('colegios-profesionales')
export class ProfessionalCollegesController {
  constructor(
    private readonly professionalCollegesService: ProfessionalCollegesService,
  ) {}

  @Get()
  findAll() {
    return this.professionalCollegesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.professionalCollegesService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateProfessionalCollegeDto) {
    return this.professionalCollegesService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProfessionalCollegeDto,
  ) {
    return this.professionalCollegesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.professionalCollegesService.remove(id);
  }
}

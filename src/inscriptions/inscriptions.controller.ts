import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { InscriptionsService } from './inscriptions.service';
import { CreateInscriptionDto } from './application/dto/create-inscription.dto';
import { RecoverInscriptionAccessDto } from './application/dto/recover-inscription-access.dto';
import { UpdateInscriptionDto } from './application/dto/update-inscription.dto';
import { VerifyInscriptionAccessDto } from './application/dto/verify-inscription-access.dto';
import { extractBearerToken } from '../security/session-token.util';

@Controller('inscriptions')
export class InscriptionsController {
  constructor(private readonly inscriptionsService: InscriptionsService) {}

  @Get()
  findAll() {
    return this.inscriptionsService.findAll();
  }

  @Get('access/:token')
  findByContinuationToken(@Param('token') token: string) {
    return this.inscriptionsService.findByContinuationToken(token);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inscriptionsService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateInscriptionDto) {
    return this.inscriptionsService.create(body);
  }

  @Post('recover-access')
  recoverAccess(@Body() body: RecoverInscriptionAccessDto) {
    return this.inscriptionsService.recoverAccess(body);
  }

  @Post('access/verify')
  verifyAccess(@Body() body: VerifyInscriptionAccessDto) {
    return this.inscriptionsService.verifyAccess(body);
  }

  @Get('access/me')
  getCurrentDelegate(@Headers('authorization') authorization?: string) {
    const token = extractBearerToken(authorization);

    if (!token) {
      throw new UnauthorizedException(
        'Debes enviar un token Bearer valido.',
      );
    }

    return this.inscriptionsService.getCurrentDelegate(token);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateInscriptionDto,
  ) {
    return this.inscriptionsService.update(id, body);
  }
}

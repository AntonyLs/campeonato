import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { extractBearerToken } from '../security/session-token.util';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { DelegateLoginDto } from './dto/delegate-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  loginAdmin(@Body() body: AdminLoginDto) {
    return this.authService.loginAdmin(body);
  }

  @Get('admin/me')
  getCurrentAdmin(@Headers('authorization') authorization?: string) {
    const token = extractBearerToken(authorization);

    if (!token) {
      throw new UnauthorizedException(
        'Debes enviar un token Bearer valido.',
      );
    }

    return this.authService.getCurrentAdmin(token);
  }

  @Post('delegate/login')
  loginDelegate(@Body() body: DelegateLoginDto) {
    return this.authService.loginDelegate(body);
  }

  @Get('delegate/me')
  getCurrentDelegate(@Headers('authorization') authorization?: string) {
    const token = extractBearerToken(authorization);

    if (!token) {
      throw new UnauthorizedException(
        'Debes enviar un token Bearer valido.',
      );
    }

    return this.authService.getCurrentDelegate(token);
  }
}

import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PlayersModule } from '../players/players.module';
import { StorageModule } from '../storage/storage.module';
import { TeamsModule } from '../teams/teams.module';
import { UsersModule } from '../users/users.module';
import { DelegateController } from './delegate.controller';
import { DelegateService } from './delegate.service';

@Module({
  imports: [AuthModule, UsersModule, TeamsModule, PlayersModule, StorageModule],
  controllers: [DelegateController],
  providers: [DelegateService],
})
export class DelegateModule {}

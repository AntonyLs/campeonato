import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InscriptionsModule } from './inscriptions/inscriptions.module';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [InscriptionsModule, UsersModule, TeamsModule, PlayersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

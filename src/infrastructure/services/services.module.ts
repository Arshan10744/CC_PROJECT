import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../orm/repositories/repositories.module';
import { OrganizationRepository } from '../orm/repositories/organization.repository';
import { InfrastructureControllerModule } from '../presenter/infrastructureModule';

@Module({
  imports: [InfrastructureControllerModule],
})
export class ServicesModule {}

import { CommonModule } from '@modules/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService, sevices } from './domain/services';
import { useCases } from './domain/useCases';
import { RoleRepository, repositories } from './infrastructure/repositories';
import { RoleSchema } from './infrastructure/schemas';
import { controllers } from './presentation/controllers';

@Module({
    imports: [
        TypeOrmModule.forFeature([RoleSchema]),
        CommonModule
    ],
    controllers,
    providers: [
        ...useCases,
        ...sevices,
        ...repositories
    ],
    exports: [
        RoleService,
        RoleRepository
    ]
})
export class RoleModule
{}

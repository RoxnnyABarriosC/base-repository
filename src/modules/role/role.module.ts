import { CommonModule } from '@modules/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import services from './domain/services';
import useCases from './domain/useCases';
import repositories from './infrastructure/repositories';
import { RoleSchema } from './infrastructure/schemas';
import controllers from './presentation/controllers';

@Module({
    imports: [
        TypeOrmModule.forFeature([RoleSchema]),
        CommonModule
    ],
    controllers: [...controllers],
    providers: [
        ...useCases,
        ...services,
        ...repositories
    ],
    exports: [
        ...services,
        ...repositories
    ]
})
export class RoleModule
{}

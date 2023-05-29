import { User } from '@modules/auth/user/domain/entities';
import { UserService } from '@modules/auth/user/domain/services';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import {  UpdateUserDto } from '@modules/auth/user/presentation/dtos';
import { Injectable, Logger } from '@nestjs/common';

interface Props {
    id: string;
    dto: UpdateUserDto;
}

@Injectable()
export class UpdateUserUseCase
{
    private readonly logger = new Logger(UpdateUserUseCase.name);

    constructor(
        private readonly repository: UserRepository,
        private readonly service: UserService
    )
    {}

    /* TODO:
     * Afuturo es necesario validar despues de cuanto tiempo ya no sera
     * posible la actualizacion de un usuario desde el panel de administracion
     * (por ejemplo, 1 mes despues de su creacion) ademas este tiempo debe ser
     * definido en las variables de entorno
     * */
    async handle({ id, dto }: Props): Promise<User>
    {
        this.logger.log('Getting user...');

        let user = await this.repository.getOne({ id, withDeleted: true });

        void this.service.checkSuperAdmin(user);

        user.build(dto);

        void await this.service.validate(user);

        user = await this.repository.update(user) as User;

        this.logger.log('User updated!');

        return user;
    }
}

import { AuthModule } from '@modules/auth';
import { CommonModule } from '@modules/common';
import { RoleModule } from '@modules/role';
import { UserService } from '@modules/user/domain/services';
import {
    DeleteUserUseCase, EnableOrDisableUserUseCase, GetUserByUserNameUseCase,
    GetUserUseCase,
    ListUsersUseCase, ResetPasswordUseCase, RestoreUserUseCase,
    SaveUserUseCase, SetRolesUserUseCase, UpdatePermissionsUserUseCase, UpdateUserUseCase, VerifyOrUnverifyUserUseCase
} from '@modules/user/domain/useCases';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { UserSchema } from '@modules/user/infrastructure/schemas';
import { UserController } from '@modules/user/presentation/controllers';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserSchema]),
        forwardRef(() => AuthModule),
        CommonModule,
        RoleModule
    ],
    controllers: [UserController],
    providers: [
        SaveUserUseCase,
        ListUsersUseCase,
        GetUserUseCase,
        DeleteUserUseCase,
        RestoreUserUseCase,
        UpdateUserUseCase,
        EnableOrDisableUserUseCase,
        VerifyOrUnverifyUserUseCase,
        GetUserByUserNameUseCase,
        ResetPasswordUseCase,
        UpdatePermissionsUserUseCase,
        SetRolesUserUseCase,
        UserRepository,
        UserService
    ],
    exports: [UserService, UserRepository]
})
export class UserModule
{}

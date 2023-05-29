import { AuthModule } from '@modules/auth';
import { RoleModule } from '@modules/auth/role';
import { UserService } from '@modules/auth/user/domain/services';
import {
    DeleteUserUseCase, EnableOrDisableUserUseCase,
    GetUserUseCase,
    ListUsersUseCase, ResetPasswordUseCase, RestoreUserUseCase,
    SaveUserUseCase, SetRolesUserUseCase, UpdatePermissionsUserUseCase, UpdateUserUseCase, VerifyOrUnverifyUserUseCase
} from '@modules/auth/user/domain/useCases';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { UserSchema } from '@modules/auth/user/infrastructure/schemas';
import { UserController } from '@modules/auth/user/presentation/controllers';
import { CommonModule } from '@modules/common';
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

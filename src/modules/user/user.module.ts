import { AuthModule } from '@modules/auth';
import { CommonModule } from '@modules/common';
import { RoleModule } from '@modules/role';
import { UserToDeleteView } from '@modules/user/infrastructure/views';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPolicyService, UserService } from './domain/services';
import {
    BlockUserUseCase,
    DeleteUserUseCase,
    EnableOrDisableUserUseCase,
    GetUserByUserNameUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    ResetPasswordUseCase,
    RestoreUserUseCase,
    SaveUserUseCase,
    SetRolesUserUseCase,
    UpdatePermissionsUserUseCase,
    UpdateUserUseCase,
    VerifyOrUnverifyUserUseCase
} from './domain/useCases';
import { UserRepository } from './infrastructure/repositories';
import { UserSchema } from './infrastructure/schemas';
import { UserController } from './presentation/controllers';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserSchema, UserToDeleteView]),
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
        BlockUserUseCase,
        UserRepository,
        UserService,
        UserPolicyService
    ],
    exports: [UserService, UserRepository, UserPolicyService]
})
export class UserModule
{}

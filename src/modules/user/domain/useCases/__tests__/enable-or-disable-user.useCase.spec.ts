import { User } from '@modules/user/domain/entities';
import { UserService } from '@modules/user/domain/services';
import { EnableOrDisableUserUseCase } from '@modules/user/domain/useCases';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundCustomException } from '@shared/app/exceptions';
import { I18nContext } from 'nestjs-i18n';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('EnableOrDisableUserUseCase', () =>
{
    let useCase: EnableOrDisableUserUseCase;
    let repository: UserRepository;
    let service: UserService;

    const userMock = new User({ userName: 'test', enable: false });

    beforeEach(async() =>
    {
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                EnableOrDisableUserUseCase,
                {
                    provide: UserRepository,
                    useValue: {
                        getOne: vi.fn().mockResolvedValue(userMock),
                        update: vi.fn().mockResolvedValue(userMock)
                    }
                },
                {
                    provide: UserService,
                    useValue: {
                        checkSuperAdmin: vi.fn().mockResolvedValue(null)
                    }
                }
            ]
        }).compile();

        useCase = app.get<EnableOrDisableUserUseCase>(EnableOrDisableUserUseCase);
        repository = app.get<UserRepository>(UserRepository);
        service = app.get<UserService>(UserService);
    });

    afterEach(() =>
    {
        vi.restoreAllMocks();
    });

    it('should be defined', () =>
    {
        expect(useCase).toBeDefined();
        expect(useCase.handle).toBeDefined();

        expect(repository).toBeDefined();
        expect(repository.update).toBeDefined();
        expect(repository.getOne).toBeDefined();

        expect(service).toBeDefined();
    });

    describe('handle()', () =>
    {
        describe('success', () =>
        {
            it('should change the status from active to inactive', async() =>
            {
                // Arrange
                const id = 'user-id';
                const enable = false;

                vi.spyOn(I18nContext, 'current').mockReturnValue(<any>{
                    translate: vi.fn((key: string) => 'translate_message')
                });

                // Act
                const result = await useCase.handle({ id, enable });

                // Assert
                expect(result).toBeDefined();
                expect(result.messageCode).toContain('disabled');
            });

            it('should change the status from inactive to active', async() =>
            {
                // Arrange
                const id = 'user-id';
                const enable = true;

                vi.spyOn(I18nContext, 'current').mockReturnValue(<any>{
                    translate: vi.fn((key: string) => 'translate_message')
                });

                // Act
                const result = await useCase.handle({ id, enable });

                // Assert
                expect(result).toBeDefined();
                expect(result.messageCode).toContain('enabled');
            });
        });

        describe('error', () =>
        {
            it('should throw an error if the user does not exist', async() =>
            {
                // Arrange
                const id = 'user-id';
                const enable = true;

                vi.spyOn(I18nContext, 'current').mockReturnValue(<any>{
                    translate: vi.fn((key: string) => 'translate_message')
                });

                const getOneError = new NotFoundCustomException(User.name);

                vi.spyOn(repository, 'getOne').mockRejectedValueOnce(getOneError);

                try
                {
                    // Act
                    await useCase.handle({ id, enable });
                    // Assert
                    throw new Error('Expected an error to be thrown.');
                }
                catch (error)
                {
                    // Assert
                    expect(error).toBe(getOneError);
                }
            });
        });
    });
});

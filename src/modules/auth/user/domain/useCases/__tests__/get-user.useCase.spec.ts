import { User } from '@modules/auth/user/domain/entities';
import {  GetUserUseCase } from '@modules/auth/user/domain/useCases';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundCustomException } from '@shared/exceptions';
import { I18nContext } from 'nestjs-i18n';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('GetUserUseCase', () =>
{
    let useCase: GetUserUseCase;
    let repository: UserRepository;

    const userMock = new User({ userName: 'test' });

    beforeEach(async() =>
    {
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                GetUserUseCase,
                {
                    provide: UserRepository,
                    useValue: {
                        getOneByUserName: vi.fn().mockResolvedValue(userMock)
                    }
                }
            ]
        }).compile();

        useCase = app.get<GetUserUseCase>(GetUserUseCase);
        repository = app.get<UserRepository>(UserRepository);
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
        expect(repository.getOneByUserName).toBeDefined();
    });

    describe('handle()', () =>
    {
        describe('success', () =>
        {
            it('should get a user', async() =>
            {
                // Arrange
                const userName = 'test';
                const partialRemoved = false;

                // Act
                const result = await useCase.handle({ userName, partialRemoved });

                // Assert
                expect(result).toBeDefined();
                expect(result.userName).toEqual(userMock.userName);
            });
        });

        describe('error', () =>
        {
            it('should throw an error if user not exist', async() =>
            {
                // Arrange
                const userName = 'test';
                const partialRemoved = false;

                vi.spyOn(I18nContext, 'current').mockReturnValue(<any>{
                    translate: vi.fn((key: string) => 'translate_message')
                });

                const getOneError = new NotFoundCustomException(User.name);

                vi.spyOn(repository, 'getOneByUserName').mockRejectedValueOnce(getOneError);

                try
                {
                    // Act
                    await useCase.handle({ userName, partialRemoved });
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

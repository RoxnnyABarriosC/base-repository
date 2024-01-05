import { User } from '@modules/user/domain/entities';
import { DeleteUserUseCase } from '@modules/user/domain/useCases';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundCustomException } from '@shared/app/exceptions';
import { I18nContext } from 'nestjs-i18n';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('DeleteUserUseCase', () =>
{
    let useCase: DeleteUserUseCase;
    let repository: UserRepository;

    const userMock = new User({ userName: 'test' });

    beforeEach(async() =>
    {
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                DeleteUserUseCase,
                {
                    provide: UserRepository,
                    useValue: {
                        delete: vi.fn().mockResolvedValue(userMock),
                        disable: vi.fn().mockResolvedValue(undefined)
                    }
                }
            ]
        }).compile();

        useCase = app.get<DeleteUserUseCase>(DeleteUserUseCase);
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
        expect(repository.delete).toBeDefined();
    });

    describe('handle()', () =>
    {
        describe('success', () =>
        {
            it('should delete a user permanently', async() =>
            {
                // Arrange
                const id = 'user-id';
                const deletePermanently = true;

                // Act
                const result = await useCase.handle({ id, deletePermanently });

                // Assert
                expect(result).toBeDefined();
                expect(result.userName).toEqual(userMock.userName);
            });

            it('should soft delete a user', async() =>
            {
                // Arrange
                const id = 'user-id';
                const deletePermanently = false;

                // Act
                const result = await useCase.handle({ id, deletePermanently });

                // Assert
                expect(result).toBeDefined();
                expect(result.userName).toEqual(userMock.userName);
            });
        });

        describe('error', () =>
        {
            it('should throw an error if user deletion fails', async() =>
            {
                // Arrange
                const id = 'user-id';
                const deletePermanently = true;

                vi.spyOn(I18nContext, 'current').mockReturnValue(<any>{
                    translate: vi.fn((key: string) => 'translate_message')
                });

                const deleteError = new NotFoundCustomException(User.name);

                vi.spyOn(repository, 'delete').mockRejectedValueOnce(deleteError);

                try
                {
                    // Act
                    await useCase.handle({ id, deletePermanently });
                    // Assert
                    throw new Error('Expected an error to be thrown.');
                }
                catch (error)
                {
                    // Assert
                    expect(error).toBe(deleteError);
                }
            });
        });
    });
});

import { IMyStore, StoreModule } from '@modules/common/store';
import { User } from '@modules/user/domain/entities';
import { ListUsersUseCase } from '@modules/user/domain/useCases';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Test, TestingModule } from '@nestjs/testing';
import { ClsService } from 'nestjs-cls';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('ListUsersUseCase', () =>
{
    let useCase: ListUsersUseCase;
    let repository: UserRepository;
    let store: ClsService<IMyStore>;

    const storeObject = { res: { pagination: null, metadata: null } } as IMyStore;

    const userMock = new User({ userName: 'test' });

    beforeEach(async() =>
    {
        const app: TestingModule = await Test.createTestingModule({
            imports: [StoreModule],
            providers: [
                ListUsersUseCase,
                {
                    provide: UserRepository,
                    useValue: {
                        list: vi.fn().mockResolvedValue({
                            paginate: vi.fn().mockResolvedValue([userMock]),
                            getPagination: vi.fn().mockResolvedValue({ total: 1 }),
                            getMetadata: vi
                                .fn()
                                .mockImplementation(() => ({ meta: true }))
                        })
                    }
                }
            ]
        }).compile();

        useCase = app.get<ListUsersUseCase>(ListUsersUseCase);
        repository = app.get<UserRepository>(UserRepository);
        store = app.get<ClsService<IMyStore>>(ClsService);
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
        expect(repository.list).toBeDefined();
    });

    describe('handle()', () =>
    {
        describe('success', () =>
        {
            it('should get a user', async() =>
            {
                // Act
                const result = await store.runWith(storeObject, () => useCase.handle({ criteria: {} as any }));

                // Assert
                expect(result).toBeDefined();
                expect(result.length).toEqual(1);
                expect(storeObject.res.pagination['total']).toEqual(1);
                expect(storeObject.res.metadata['meta']).toEqual(true);
            });
        });
    });
});

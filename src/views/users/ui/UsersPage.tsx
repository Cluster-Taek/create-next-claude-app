import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { usersQueryOptions } from '@/entities/user';
import { getQueryClient } from '@/shared/api';
import { verifySession } from '@/shared/lib/auth';
import { CreateUserButton } from './CreateUserButton';
import { UsersList } from './UsersList';

export async function UsersPage() {
  await verifySession();

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(usersQueryOptions({ _page: 1, _per_page: 10 }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex w-full flex-col items-center justify-center h-full">
        <UsersList />
        <CreateUserButton />
      </div>
    </HydrationBoundary>
  );
}

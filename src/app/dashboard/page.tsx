import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { UserProfile, UserList } from '@/features/user';
import { LogoutButton } from '@/features/auth';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-muted/50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <LogoutButton />
        </div>
        <UserProfile />
        {session.user.role === 'ADMIN' && <UserList />}
      </div>
    </div>
  );
}

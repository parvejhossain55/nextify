import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { UserProfile, UserList } from "@/features/user";
import { LogoutButton } from "@/features/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="bg-muted/50 min-h-screen p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <LogoutButton />
        </div>
        <UserProfile />
        {session.user.role === "ADMIN" && <UserList />}
      </div>
    </div>
  );
}

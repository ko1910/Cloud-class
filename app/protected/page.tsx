import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; 

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login?callbackUrl=/protected");
  }

  return (
    <div>
      Xin chào {session.user?.name} (vai trò: {(session.user as any).role})
    </div>
  );
}

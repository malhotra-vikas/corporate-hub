import { getChatsByUserId } from '@/lib/db/queries';
import { useAuth } from "@/lib/auth-context"
import UserApi from "@/lib/api/user.api"

export async function GET() {
  const { user, loading } = useAuth()

  if (!user) {
    return Response.json('Unauthorized!', { status: 401 });
  }

  // biome-ignore lint: Forbidden non-null assertion.
  const chats = await getChatsByUserId({ id: user._id });
  return Response.json(chats);
}

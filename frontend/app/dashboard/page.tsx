import { createServerClient } from "@/lib/supabase/server";
import { DashboardView } from "./dashboard-view";

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <DashboardView email={user?.email ?? ""} />;
}

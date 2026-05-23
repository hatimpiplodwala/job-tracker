import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Landing } from "@/components/landing";

export default async function RootPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }
  return <Landing />;
}

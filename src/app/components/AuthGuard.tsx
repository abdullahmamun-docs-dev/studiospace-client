
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkLogin() {
      const { data } = await authClient.getSession();

      if (!data?.user) {
        router.replace(`/auth/login?redirect=${pathname}`);
        return;
      }

      setChecking(false);
    }

    checkLogin();
  }, [pathname, router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted">Checking your account...</p>
      </main>
    );
  }

  return <>{children}</>;
}

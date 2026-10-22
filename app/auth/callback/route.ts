import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const destination = url.searchParams.get("next") || "/painel";
  const next = destination.startsWith("/") && !destination.startsWith("//") ? destination : "/painel";
  const authError = url.searchParams.get("error");
  if (authError) {
    const errorCode = url.searchParams.get("error_code");
    const target = errorCode === "otp_expired" ? "/senha/recuperar?link=expirado" : "/entrar?erro=link";
    return NextResponse.redirect(new URL(target, url.origin));
  }
  const code = url.searchParams.get("code");
  if (code) {
    const cookieStore = await cookies();
    const pendingCookies: { name: string; value: string; options: CookieOptions }[] = [];
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (values) => {
            values.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
            pendingCookies.push(...values);
          },
        },
      },
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    const response = NextResponse.redirect(new URL(error ? "/entrar?erro=link" : next, url.origin));
    pendingCookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
    return response;
  }
  return NextResponse.redirect(new URL("/entrar?erro=link", url.origin));
}

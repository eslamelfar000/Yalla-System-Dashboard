import DashBoardLayoutProvider from "@/provider/dashboard.layout.provider";
import { redirect } from "next/navigation";
import { getDictionary } from "@/app/dictionaries";
import { cookies } from "next/headers";

const layout = async ({ children, params: { lang } }) => {
  // Check for custom authentication token
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token");

  // If no token, redirect to login
  if (!authToken?.value) {
    redirect(`/${lang}/auth/login`);
  }

  // Get dictionary for translations
  const trans = await getDictionary(lang);

  return (
    <DashBoardLayoutProvider trans={trans}>{children}</DashBoardLayoutProvider>
  );
};

export default layout;

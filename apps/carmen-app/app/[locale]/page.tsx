'use client';
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/lib/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Home() {
  const t = useTranslations("HomePage");
  const router = useRouter();

  return (
    <div className="p-8">
      <LanguageSwitcher />

      <div className="mt-16 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
        <p className="text-lg">{t("welcome")}</p>
        <div className="flex flex-col gap-4 mt-4">
          <Link href="/dashboard" className="bg-blue-500 text-white p-2 rounded-md text-center">Dashboard</Link>
          <button onClick={() => router.push("/profile")} className="bg-blue-500 text-white p-2 rounded-md">Profile</button>
        </div>
      </div>
    </div>
  );
}

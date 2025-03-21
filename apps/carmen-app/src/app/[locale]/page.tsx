import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("HomePage");
  return (
    <div>
      <h1 className="text-4xl font-bold text-black">{t("title")}</h1>
    </div>
  );
}

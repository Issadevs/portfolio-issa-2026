import CVPageClient from "./CVPageClient";
import { getPortfolioSettings } from "@/lib/settings";

export const revalidate = 60;

export default async function CVPage() {
  const settings = await getPortfolioSettings();
  return <CVPageClient settings={settings} />;
}

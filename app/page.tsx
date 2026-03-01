import { getPortfolioSettings } from "@/lib/settings";
import PortfolioClient from "@/components/PortfolioClient";

export const revalidate = 60;

export default async function Page() {
  const settings = await getPortfolioSettings();
  return <PortfolioClient settings={settings} />;
}

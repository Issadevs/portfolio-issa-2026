"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/shared/Header";
import CVDocument from "@/components/cv-document/CVDocument";
import { useLang } from "@/hooks/useLang";
import type { PortfolioSettings } from "@/lib/settings";

interface CVPageClientProps {
  settings: PortfolioSettings;
}

export default function CVPageClient({ settings }: CVPageClientProps) {
  const router = useRouter();
  const { lang, toggleLang, t } = useLang();

  function handlePrint() {
    window.print();
  }

  function handleSwitchToDev() {
    sessionStorage.setItem("portfolio_mode", "dev");
    document.documentElement.classList.add("dark");
    router.push("/");
  }

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          .no-print { display: none !important; }
          body { background: white !important; }
          #cv-document { box-shadow: none !important; margin: 0 !important; }
        }
      `}</style>

      <div className="no-print">
        <Header
          mode="cv"
          lang={lang}
          t={t}
          onToggleMode={handleSwitchToDev}
          onToggleLang={toggleLang}
          isGlitching={false}
          basePath="/"
        />
      </div>

      <div className="min-h-screen bg-cv-bg pt-16 pb-16 flex flex-col items-center gap-4">
        <div className="no-print w-full max-w-[794px] flex justify-end px-1 pt-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-cv-border text-cv-muted rounded-lg text-xs font-medium hover:border-cv-accent hover:text-cv-accent transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            {lang === "fr" ? "Imprimer / PDF" : "Print / PDF"}
          </button>
        </div>

        <div style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.10)" }}>
          <CVDocument lang={lang} settings={settings} />
        </div>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import { AppDocPage, LegalSections } from "@/components/app-doc";
import { APP_NAME, LEGAL_UPDATED_AT, TERMS } from "@/content/app-legal";

// App Store Connect に出す利用規約の URL。検索には出さない (サイトマップにも載せない)
export const metadata: Metadata = {
  title: `${APP_NAME} 利用規約`,
  description: `アプリ「${APP_NAME}」の利用規約。`,
  robots: { index: false },
};

export default function AppTermsPage() {
  return (
    <AppDocPage current="/app/terms" title="利用規約" updatedAt={LEGAL_UPDATED_AT}>
      <LegalSections sections={TERMS} />
    </AppDocPage>
  );
}

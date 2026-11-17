import type { Metadata } from "next";
import { AppDocPage, LegalSections } from "@/components/app-doc";
import { APP_NAME, LEGAL_UPDATED_AT, PRIVACY } from "@/content/app-legal";

// App Store Connect に出すプライバシーポリシーの URL。検索には出さない (サイトマップにも載せない)
export const metadata: Metadata = {
  title: `${APP_NAME} プライバシーポリシー`,
  description: `アプリ「${APP_NAME}」のプライバシーポリシー。`,
  robots: { index: false },
};

export default function AppPrivacyPage() {
  return (
    <AppDocPage current="/app/privacy" title="プライバシーポリシー" updatedAt={LEGAL_UPDATED_AT}>
      <LegalSections sections={PRIVACY} />
    </AppDocPage>
  );
}

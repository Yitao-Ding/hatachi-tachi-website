import type { Metadata } from "next";
import Link from "next/link";
import { AppDocPage, DocSection, linkClass } from "@/components/app-doc";
import { APP_NAME, OPERATOR_NAME, SUPPORT_CONTACT } from "@/content/app-legal";

// App Store Connect に出すサポートの URL。検索には出さない (サイトマップにも載せない)。
// この文はサイト側にしか無い。アプリの画面の名前 (自分 → 設定 → 退会する など) を変えたらここも直す
export const metadata: Metadata = {
  title: `${APP_NAME} サポート`,
  description: `アプリ「${APP_NAME}」の問い合わせ先と、よくある困りごと。`,
  robots: { index: false },
};

const mail = (
  <a href={`mailto:${SUPPORT_CONTACT}`} className={linkClass}>
    {SUPPORT_CONTACT}
  </a>
);

export default function AppSupportPage() {
  return (
    <AppDocPage current="/app/support" title="サポート">
      <DocSection heading="問い合わせ">
        <p>アプリについての質問や困ったことは、メールで運営 ({OPERATOR_NAME}) に送ってください。</p>
        <p>{mail}</p>
      </DocSection>

      <DocSection heading="招待コード">
        <p>
          アプリを使い始めるには招待コードが要ります。招待コードは運営がハタチたちの参加者に配ります。手元に無い時は運営に聞いてください。
        </p>
      </DocSection>

      <DocSection heading="退会 (アカウントの削除)">
        <p>
          アプリの「自分」→「設定」→「退会する」から、いつでもアカウントを削除できます。退会すると、アカウントと生徒手帳、自分の投稿や発言、出欠などの記録が消え、元に戻せません。退会しても残るものは
          <Link href="/app/privacy" className={linkClass}>
            プライバシーポリシー
          </Link>
          の「消すこと」に書いています。
        </p>
      </DocSection>

      <DocSection heading="アプリを消してしまって入れない時">
        <p>
          アカウントは端末ごとに作るので、アプリを消したり端末を替えたりすると、前のアカウントに戻れないことがあります。前のアカウントを消したい時は、アプリで使っていた名前と期を書いて{" "}
          {mail} にメールしてください。運営が確かめてから削除します。
        </p>
      </DocSection>

      <DocSection heading="通報とブロック">
        <p>
          決まりに反する投稿は、投稿の「…」のメニューや長押しで出るメニューの「通報する」から運営に知らせられます。人を通報する時は、その人の生徒手帳の一番下にある「この人を通報」を使います。通報は運営が確かめ、投稿を見えなくするなどの対応をします。
        </p>
        <p>
          特定の人の投稿を見たくない時は、その人の生徒手帳の「この人をブロック」でブロックできます。ブロックした人の投稿は出なくなります。解除は「自分」→「設定」→「ブロックした人」からできます。
        </p>
      </DocSection>
    </AppDocPage>
  );
}

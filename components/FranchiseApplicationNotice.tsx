"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Clause = { en: string; si: string; text: string; translation: string };
type NoticeProps = {
  title: { en: string; si: string };
  clauses: Clause[];
  version: string;
  contactNote?: { en: string; si: string };
};

export default function FranchiseApplicationNotice(props: NoticeProps) {
  const lang = useSearchParams().get("lang") === "si" ? "si" : "en";
  return <FranchiseNoticeContent {...props} lang={lang} />;
}

export function FranchiseNoticeContent({ title, clauses, version, contactNote, lang }: NoticeProps & { lang: "en" | "si" }) {
  const t = (en: string, si: string) => lang === "si" ? si : en;

  return (
    <article lang={lang} className="mx-auto max-w-3xl space-y-8 px-5 py-12 sm:py-20">
      <header className="border-b border-ink/20 pb-6">
        <nav aria-label={t("Notice language", "නිවේදනයේ භාෂාව")} className="mb-5 inline-flex gap-1 rounded-xl border border-ink/15 bg-white p-1">
          {([["en", "English"], ["si", "සිංහල"]] as const).map(([mode, label]) => (
            <Link key={mode} href={`?lang=${mode}`} replace scroll={false} lang={mode}
              aria-current={lang === mode ? "page" : undefined}
              className="inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-bold aria-current:bg-ink aria-current:text-white">
              {label}
            </Link>
          ))}
        </nav>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
          {title[lang]}
        </h1>
        <p className="mt-3 text-sm text-ink/70">{t("Version", "අනුවාදය")} {version}</p>
      </header>
      {clauses.map((clause) => (
        <section key={clause.en} className="space-y-3 leading-relaxed">
          <h2 className="text-xl font-bold">{clause[lang]}</h2>
          <p>{t(clause.text, clause.translation)}</p>
        </section>
      ))}
      {contactNote && <p>{contactNote[lang]}</p>}
      <Link href="/contact" className="inline-flex min-h-12 items-center font-bold underline underline-offset-4">
        {t("Contact RedCat", "RedCat අමතන්න")}
      </Link>
    </article>
  );
}

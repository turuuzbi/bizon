import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export async function SiteFooter() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <footer className="mt-12 bg-[#1f1828] text-white">
      <div className="mx-auto w-full max-w-340 px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur">
                <BrandLogo size="sm" className="h-10 w-auto" />
              </div>
              <div className="leading-tight">
                <p className="font-[family:var(--font-display)] text-xl font-semibold tracking-[-0.03em]">
                  {t.footer.aboutTitle}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c8b7e2]">
                  Erka&apos;s
                </p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/70">
              {t.footer.aboutCopy}
            </p>
            <div className="flex items-center gap-3">
              {[
                {
                  label: "Facebook",
                  path: "M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07c0 5 3.66 9.13 8.44 9.87v-6.98H7.9v-2.89h2.54V9.84c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.57v1.88h2.77l-.44 2.89h-2.33V22c4.78-.74 8.43-4.87 8.43-9.93z",
                },
                {
                  label: "Instagram",
                  path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38 3.7 3.7 0 0 1-1.38.9c-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.94c-3.15 0-3.5.01-4.74.07-1.07.05-1.65.23-2.04.38-.51.2-.88.44-1.27.82-.39.39-.63.76-.82 1.27-.15.39-.33.97-.38 2.04-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.07.23 1.65.38 2.04.2.51.44.88.82 1.27.39.39.76.63 1.27.82.39.15.97.33 2.04.38 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.07-.05 1.65-.23 2.04-.38.51-.2.88-.44 1.27-.82.39-.39.63-.76.82-1.27.15-.39.33-.97.38-2.04.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.07-.23-1.65-.38-2.04a3.4 3.4 0 0 0-.82-1.27 3.4 3.4 0 0 0-1.27-.82c-.39-.15-.97-.33-2.04-.38C15.5 4.11 15.15 4.1 12 4.1zm0 3.3a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2zm0 1.94a2.66 2.66 0 1 0 0 5.32 2.66 2.66 0 0 0 0-5.32zm5.85-2.18a1.08 1.08 0 1 1-2.16 0 1.08 1.08 0 0 1 2.16 0z",
                },
                {
                  label: "TikTok",
                  path: "M21 8.5a7.5 7.5 0 0 1-5.4-2.3v8.9a6.4 6.4 0 1 1-6.4-6.4v3a3.4 3.4 0 1 0 3.4 3.4V2h3a4.5 4.5 0 0 0 4.5 4.5z",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[#c8b7e2] hover:text-white"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c8b7e2]">
              {t.footer.companyTitle}
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  {t.footer.company.about}
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  {t.footer.company.careers}
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  {t.footer.company.press}
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  {t.footer.company.partners}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c8b7e2]">
              {t.footer.helpTitle}
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  {t.footer.help.faq}
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  {t.footer.help.shipping}
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  {t.footer.help.returns}
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  {t.footer.help.warranty}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c8b7e2]">
                {t.footer.contactTitle}
              </p>
              <div className="mt-4 space-y-2 text-sm text-white/70">
                <p>{t.footer.address}</p>
                <p>
                  <a href={`tel:${t.footer.phone}`} className="hover:text-white">
                    {t.footer.phone}
                  </a>
                </p>
                <p>
                  <a
                    href={`mailto:${t.footer.email}`}
                    className="hover:text-white"
                  >
                    {t.footer.email}
                  </a>
                </p>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c8b7e2]">
                {t.footer.hoursTitle}
              </p>
              <div className="mt-4 space-y-1.5 text-sm text-white/70">
                <p>{t.footer.hoursWeekday}</p>
                <p>{t.footer.hoursSaturday}</p>
                <p>{t.footer.hoursSunday}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Erka&apos;s. {t.footer.rights}
          </p>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">{t.language.label}:</span>
            <LanguageSwitcher current={locale} variant="utility" />
          </div>
        </div>
      </div>
    </footer>
  );
}

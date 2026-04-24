import Image from "next/image";
import Link from "next/link";

import { SiteAuthActions } from "@/components/site-auth-actions";

const navigationItems = [
  { label: "Ангилал", href: "#categories" },
  { label: "Төслийн үйлчилгээ", href: "#project-desk" },
  { label: "Холбоо барих", href: "#contact" },
] as const;

const metrics = [
  {
    value: "1,200+",
    label: "Каталогт оруулахад бэлэн үндсэн SKU",
  },
  {
    value: "48 цаг",
    label: "Хот доторх шуурхай хүргэлтийн боломж",
  },
  {
    value: "B2B",
    label: "Төслийн үнэ, shortlist, re-order урсгал",
  },
] as const;

const categoryCards = [
  {
    title: "Мод, хавтан",
    description:
      "Фанер, MDF, trim болон интерьерийн суурь материалын цэгцтэй сонголт.",
    meta: "126 SKU",
    tone: "linear-gradient(135deg, #e7d5bd 0%, #f7efe3 100%)",
  },
  {
    title: "Плитка, чулуу",
    description:
      "Гал тогоо, ариун цэврийн өрөө, lobby zone-д зориулсан үндсэн бүрдэл.",
    meta: "74 SKU",
    tone: "linear-gradient(135deg, #d9d6d1 0%, #f2efeb 100%)",
  },
  {
    title: "Будгийн систем",
    description:
      "Матт, сатин, хамгаалалтын бүрхүүл, праймер, sealant-ийн багц.",
    meta: "91 SKU",
    tone: "linear-gradient(135deg, #c7d2cb 0%, #edf1ee 100%)",
  },
  {
    title: "Сангийн тоноглол",
    description:
      "Faucet, shower set, ванн болон угаалтуурын сонгомол шийдлүүд.",
    meta: "58 SKU",
    tone: "linear-gradient(135deg, #c7d8de 0%, #eef4f6 100%)",
  },
  {
    title: "Цахилгаан",
    description:
      "Switch, outlet, lighting болон site-ready accessories-ийн багц.",
    meta: "67 SKU",
    tone: "linear-gradient(135deg, #d7d6cf 0%, #f1f0eb 100%)",
  },
  {
    title: "Багаж",
    description:
      "Daily-duty hand tools болон install phase-д хэрэгтэй essentials.",
    meta: "143 SKU",
    tone: "linear-gradient(135deg, #dccfc4 0%, #f4eee8 100%)",
  },
] as const;

const serviceSteps = [
  {
    title: "Shortlist",
    copy: "Архитектор, дизайнер, гүйцэтгэгчийн хэрэгцээнд таарсан барааг багцална.",
  },
  {
    title: "Quote",
    copy: "Bulk order, trade pricing болон нийлүүлэлтийн нөхцөлийг нэг цонхоор гаргана.",
  },
  {
    title: "Delivery",
    copy: "Сайт дээрх графикт тааруулсан хүргэлт, дахин захиалгын урсгалыг бэлдэнэ.",
  },
] as const;

const supportPoints = [
  "Төслийн багуудад зориулсан quote-first урсгал",
  "Saved boards болон order history нэмэхэд бэлэн бүтэц",
  "Каталог, account, project desk-ийг нэг хэлээр холбосон нүүр хуудас",
] as const;

const featuredLines = [
  {
    name: "18мм Хус фанер",
    detail: "Cabinet-grade / interior build",
    price: "98,000 MNT",
  },
  {
    name: "Soft Matte Wall Paint",
    detail: "Low sheen / easy maintenance",
    price: "46,000 MNT",
  },
  {
    name: "Hans Shower Column",
    detail: "Clean geometry / hotel-style finish",
    price: "389,000 MNT",
  },
] as const;

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#536458]">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#1d1a17] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-[#625f5a] sm:text-lg">
        {description}
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <header className="rounded-[28px] border border-black/10 bg-[#fffaf5]/90 px-5 py-4 shadow-[0_24px_60px_rgba(34,28,20,0.06)] backdrop-blur sm:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#24362f] text-sm font-semibold uppercase tracking-[0.18em] text-white">
                BZ
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#536458]">
                  Bizon
                </p>
                <p className="text-lg font-semibold tracking-[-0.03em] text-[#1d1a17]">
                  Building Materials
                </p>
              </div>
            </div>

            <nav className="hidden items-center gap-6 lg:flex">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-[#5d5a55] transition-colors hover:text-[#24362f]"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <SiteAuthActions />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_360px]">
          <div className="rounded-[36px] border border-black/10 bg-[#fffaf5] px-6 py-8 shadow-[0_24px_60px_rgba(34,28,20,0.06)] sm:p-10 lg:p-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#536458]">
              Ulaanbaatar showroom standard
            </p>

            <h1 className="mt-6 max-w-4xl text-[clamp(2.9rem,7vw,5.8rem)] font-semibold leading-[0.94] tracking-[-0.07em] text-[#1d1a17]">
              Төсөл болон өдөр тутмын худалдан авалтад зориулсан
              <span className="block text-[#24362f]">
                илүү цэгцтэй, илүү итгэл төрүүлэх
              </span>
              барилгын материалын нүүр хуудас
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#625f5a] sm:text-lg">
              Bizon-ийн гол ангилал, project support, quote request болон
              account entry-ийг нэг тайван бүтэц дээр төвлөрүүлж, одоогийн
              хэт олон эффекттэй мэдрэмжийг илүү мэргэжлийн storefront болгон
              зөөлрүүллээ.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#categories"
                className="rounded-full bg-[#24362f] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1c2924]"
              >
                Ангилал үзэх
              </a>
              <a
                href="#project-desk"
                className="rounded-full border border-black/10 bg-white px-6 py-3.5 text-sm font-medium text-[#2d2a27] transition-colors hover:border-[#24362f] hover:text-[#24362f]"
              >
                Төслийн үйлчилгээ
              </a>
            </div>

            <dl className="mt-10 grid gap-4 sm:grid-cols-3">
              {metrics.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-black/[0.08] bg-[#f6f1ea] p-5"
                >
                  <dt className="text-sm leading-6 text-[#625f5a]">
                    {item.label}
                  </dt>
                  <dd className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#1d1a17]">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="rounded-[36px] bg-[#24362f] p-5 text-white shadow-[0_24px_60px_rgba(24,36,31,0.18)] sm:p-6">
            <div className="rounded-[28px] bg-[#fbf6ef] p-4">
              <Image
                src="/bizon-logo.png"
                alt="Bizon building materials logo"
                width={1408}
                height={768}
                priority
                className="h-auto w-full rounded-[20px]"
              />
            </div>

            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b9c7bf]">
                Quick focus
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#f7f2ea]">
                Каталог, үнэ санал, project desk.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {supportPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-[22px] border border-white/[0.12] bg-white/[0.06] px-4 py-4 text-sm leading-6 text-[#d9e3de]"
                >
                  {point}
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section
          id="categories"
          className="rounded-[36px] border border-black/10 bg-[#fffcf8] px-6 py-8 shadow-[0_24px_60px_rgba(34,28,20,0.06)] sm:p-8 lg:p-10"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Categories"
              title="Эхний дэлгэцээс шууд ойлгогдох цэвэр ангиллын бүтэц"
              description="Илүү professional мэдрэмж өгөхийн тулд category-first урсгал руу орж, хамгийн хэрэгтэй ангиллуудыг жижиг, уншихад амархан картуудаар үлдээлээ."
            />

            <a
              href="#contact"
              className="text-sm font-semibold text-[#24362f] underline decoration-[#c9b9a3] underline-offset-4"
            >
              Trade account нээх
            </a>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {categoryCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[28px] border border-black/[0.08] bg-white p-5"
              >
                <div
                  className="h-3 rounded-full"
                  style={{ background: card.tone }}
                />
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#1d1a17]">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#625f5a]">
                      {card.description}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#eff2ed] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#536458]">
                    {card.meta}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="project-desk"
          className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)]"
        >
          <div className="rounded-[36px] border border-black/10 bg-[#fffaf5] px-6 py-8 shadow-[0_24px_60px_rgba(34,28,20,0.06)] sm:p-8 lg:p-10">
            <SectionHeading
              eyebrow="Project Desk"
              title="Нүүр хуудас дээр project workflow-ийг илүү тод болголоо"
              description="Retail browse болон B2B sourcing хоёрын аль алинд нь ойлгомжтой байх бүтэц сонгож, хэт олон промо блокийн оронд үйлчилгээний үндсэн алхмуудыг үлдээлээ."
            />

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {serviceSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-[24px] border border-black/[0.08] bg-[#f6f1ea] p-5"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#536458]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#1d1a17]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#625f5a]">
                    {step.copy}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[36px] border border-black/10 bg-[#f1ece4] px-6 py-8 shadow-[0_24px_60px_rgba(34,28,20,0.06)] sm:p-8 lg:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#536458]">
              Featured Lines
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#1d1a17]">
              Илүү цэгцтэй бүтээгдэхүүний танилцуулга
            </h2>
            <p className="mt-4 text-base leading-7 text-[#625f5a]">
              Өнгө, gradient, promo блокыг цөөлж, үнэ болон хэрэглээг нь
              ойлгомжтой унших форматаар үлдээв.
            </p>

            <div className="mt-8 space-y-3">
              {featuredLines.map((item) => (
                <div
                  key={item.name}
                  className="rounded-[24px] border border-black/[0.08] bg-white px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1d1a17]">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-[#625f5a]">
                        {item.detail}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#24362f]">
                      {item.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="rounded-[36px] bg-[#24362f] px-6 py-8 text-[#f7f2ea] shadow-[0_24px_60px_rgba(24,36,31,0.18)] sm:p-8 lg:p-10"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b9c7bf]">
                Next Step
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#f7f2ea] sm:text-5xl">
                Бараа болон төслийн урсгалыг нэг цэвэр нүүр хуудсаар эхлүүлэхэд
                бэлэн.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#dbe5df] sm:text-lg">
                Дараагийн шатанд category pages, product cards, mobile nav,
                cart entry points болон Clerk-aware account states-ийг яг энэ
                илүү restrained хэлээр үргэлжлүүлж болно.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/sign-up"
                className="rounded-full bg-[#f7f2ea] px-6 py-3.5 text-sm font-semibold text-[#24362f] transition-colors hover:bg-white"
              >
                Эхлэх
              </Link>
              <Link
                href="/sign-in"
                className="rounded-full border border-white/[0.16] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:border-white/[0.32] hover:bg-white/[0.06]"
              >
                Нэвтрэх
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

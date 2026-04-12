import Image from "next/image";

const navigationItems = [
  "Мод, хавтан",
  "Плитка, чулуу",
  "Будгийн систем",
  "Сангийн тоноглол",
  "Цахилгаан",
  "Багаж",
] as const;

const heroStats = [
  {
    value: "48h",
    label: "Хот доторх хурдан хүргэлт",
  },
  {
    value: "32",
    label: "Төслийн ангилалд тохирсон шийдэл",
  },
  {
    value: "A+",
    label: "Премиум материалын сонголт",
  },
] as const;

const serviceCards = [
  {
    index: "01",
    title: "Premium sourcing",
    copy: "Импортын брэнд, интерьерийн материал, төслийн хэрэгцээг нэг урсгалд цэгцэлсэн бүтэц.",
  },
  {
    index: "02",
    title: "Project support",
    copy: "Архитектор, дизайнер, гүйцэтгэгчдэд зориулсан shortlist, багц болон зөвлөмжийн урсгал.",
  },
  {
    index: "03",
    title: "Elegant shopping",
    copy: "HAUSPLUS-ийн showroom мэдрэмжийг хадгалсан ч илүү зөөлөн, цэвэр, амьсгалтай хуудас.",
  },
] as const;

const categoryCards = [
  {
    title: "Мод, хавтан",
    blurb: "Cabinet-grade фанер, MDF, trim болон интерьерийн суурь материал.",
    meta: "126 SKU",
    tone: "linear-gradient(135deg, #f7efe4 0%, #eed8bb 100%)",
  },
  {
    title: "Плитка, чулуу",
    blurb:
      "Гал тогоо, ариун цэврийн өрөө, lobby zone-д зориулсан refined сонголтууд.",
    meta: "74 SKU",
    tone: "linear-gradient(135deg, #f3f1ef 0%, #ddd7d0 100%)",
  },
  {
    title: "Будгийн систем",
    blurb: "Матт, сатин, хамгаалалтын бүрхүүл, праймер, sealant-ууд.",
    meta: "91 SKU",
    tone: "linear-gradient(135deg, #f6ebff 0%, #d5b8ff 100%)",
  },
  {
    title: "Сангийн тоноглол",
    blurb:
      "Minimal silhouette-тэй faucet, shower set, ванн болон угаалтуурын шийдлүүд.",
    meta: "58 SKU",
    tone: "linear-gradient(135deg, #edf5fb 0%, #c7dff0 100%)",
  },
  {
    title: "Цахилгаан",
    blurb:
      "Switch, outlet, track lighting, hidden hardware, site-ready accessories.",
    meta: "67 SKU",
    tone: "linear-gradient(135deg, #f3f2ff 0%, #cbc7ff 100%)",
  },
  {
    title: "Багаж",
    blurb:
      "Daily-duty hand tools болон install phase-д хэрэгтэй power essentials.",
    meta: "143 SKU",
    tone: "linear-gradient(135deg, #f9f1f5 0%, #f1ccd8 100%)",
  },
] as const;

const featuredProducts = [
  {
    name: "18мм Хус фанер",
    detail: "Furniture-grade / smooth face / interior build",
    price: "98,000 MNT",
    chip: "Best for cabinetry",
    art: "linear-gradient(135deg, #f1dec6 0%, #caa57f 100%)",
  },
  {
    name: "Soft Matte Wall Paint",
    detail: "Low sheen / easy maintenance / calm finish",
    price: "46,000 MNT",
    chip: "New palette",
    art: "linear-gradient(135deg, #f3e6ff 0%, #a46ef0 100%)",
  },
  {
    name: "Hans Shower Column",
    detail: "Warm metal accent / clean geometry / hotel mood",
    price: "389,000 MNT",
    chip: "Bathroom focus",
    art: "linear-gradient(135deg, #ebedf0 0%, #adb6bf 100%)",
  },
  {
    name: "Trade Workbench Set",
    detail: "Install-ready kit / clamp system / site companion",
    price: "214,000 MNT",
    chip: "Pro choice",
    art: "linear-gradient(135deg, #f4f0ea 0%, #c6b29c 100%)",
  },
] as const;

const projectZones = [
  {
    title: "Apartment Fit-Out",
    copy: "Wall finish, lighting, fittings, bathroom materials болон storage accent-уудыг нэг rhythm-д.",
    points: ["Walls", "Lighting", "Bathroom"],
  },
  {
    title: "Cafe / Retail Shell",
    copy: "High-touch гадаргуу, durable paint system, statement lighting, compact joinery materials.",
    points: ["Counters", "Flooring", "Facade"],
  },
  {
    title: "Private House Build",
    copy: "Exterior-to-interior flow-д таарах sheet goods, plumbing, hardware, finishing package.",
    points: ["Exterior", "Utility", "Interior"],
  },
] as const;

const footerLinks = [
  "Каталог",
  "Төслийн зөвлөгөө",
  "Хүргэлт",
  "Брэндүүд",
  "Contact",
] as const;

function SectionIntro({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="max-w-2xl">
      <span className="section-label">{eyebrow}</span>
      <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#1b1624] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 max-w-xl text-base leading-7 text-[#685f77] sm:text-lg">
        {copy}
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="page-veil pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <header
          className="surface-panel fade-enter p-5 sm:p-6"
          style={{ animationDelay: "80ms" }}
        >
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-35 w-35 items-center justify-center rounded-[50px] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <img src={"Purple BIZON logo.png"} />
              </div>
            </div>

            <nav className="hidden flex-wrap items-center gap-2 xl:flex">
              {navigationItems.map((item) => (
                <a
                  key={item}
                  href="#collections"
                  className="rounded-full  bg-[#fcfbff] px-4 py-2 text-sm font-medium text-[#5f5770] transition-colors hover:border-[#d8c4fa] hover:text-[#8d59e3]"
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex  items-center gap-3">
              <label className="search-shell flex w-full items-center gap-3 px-4 py-3 lg:max-w-[200px]">
                <img src={"shopping.svg"} />
                <input
                  aria-label="Search materials"
                  className="w-full bg-transparent text-sm text-[#4e465f] outline-none placeholder:text-[#aaa3b8]"
                  placeholder="Хайх материал, брэнд, ангилал"
                  type="text"
                />
              </label>

              <img src={"user.svg"} />

              <a
                href="#featured"
                className="shine-button rounded-full bg-[#a46ef0] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(164,110,240,0.28)] transition-transform hover:-translate-y-0.5"
              >
                <img src={"list.svg"} />
              </a>
            </div>
          </div>
        </header>

        <main className="flex flex-col gap-6">
          <div
            className="surface-panel hero-pattern fade-enter overflow-hidden px-6 py-8 sm:p-8 lg:p-10"
            style={{ animationDelay: "160ms" }}
          >
            <span className="section-label">Landing Direction</span>

            <h1 className=" mt-6 max-w-4xl text-[clamp(2.9rem,7vw,6.1rem)] font-semibold leading-[0.94] tracking-[-0.07em] text-[#1b1624]">
              Барилгын материалын
              <span className="block text-[#a46ef0]">
                илүү зөөлөн, илүү цэвэр
              </span>
              онлайн туршлага
            </h1>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#collections"
                className="shine-button rounded-full bg-[#a46ef0] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(164,110,240,0.28)] transition-transform hover:-translate-y-0.5"
              >
                Shop by Category
              </a>
              <a
                href="#projects"
                className="rounded-full border border-[#e7def7] bg-white px-6 py-3.5 text-sm font-medium text-[#4d445e] transition-colors hover:border-[#cdb4f8] hover:text-[#8d59e3]"
              >
                Request a Project Call
              </a>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[28px] border border-[#efe7fb] bg-white/85 p-5 shadow-[0_12px_30px_rgba(117,86,165,0.08)]"
                >
                  <p className="text-3xl font-semibold tracking-[-0.05em] text-[#19131f]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#726a82]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <section className="grid gap-4 md:grid-cols-3">
            {serviceCards.map((card, index) => (
              <div
                key={card.title}
                className="surface-panel fade-enter p-6"
                style={{ animationDelay: `${420 + index * 70}ms` }}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.26em] text-[#a46ef0]">
                  {card.index}
                </span>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#18131f]">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#6e667e]">
                  {card.copy}
                </p>
              </div>
            ))}
          </section>

          <section
            id="collections"
            className="surface-panel fade-enter p-6 sm:p-7 lg:p-8"
            style={{ animationDelay: "620ms" }}
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <SectionIntro
                eyebrow="Curated Categories"
                title="HAUSPLUS-с санаа авсан, Bizon-д илүү тайван болгосон каталогийн эхлэл"
                copy="Том ангиллуудыг showroom шиг мэдрэмжтэй card system болгон задалсан. Hover, filter, category page-уудыг үүн дээрээс дараа нь өргөжүүлж болно."
              />

              <a
                href="#featured"
                className="rounded-full border border-[#e7def7] bg-white px-5 py-3 text-sm font-medium text-[#4d445e] transition-colors hover:border-[#cdb4f8] hover:text-[#8d59e3]"
              >
                View Featured Picks
              </a>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {categoryCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-[30px] border border-[#efe7fb] bg-white p-4 shadow-[0_18px_45px_rgba(127,95,177,0.08)] transition-transform duration-300 hover:-translate-y-1"
                >
                  <div
                    className="h-40 rounded-[24px]"
                    style={{ background: card.tone }}
                  />
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#19131f]">
                      {card.title}
                    </h3>
                    <span className="rounded-full bg-[#f3ebff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8d59e3]">
                      {card.meta}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#6e667e]">
                    {card.blurb}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div
              id="featured"
              className="surface-panel fade-enter p-6 sm:p-7 lg:p-8"
              style={{ animationDelay: "720ms" }}
            >
              <SectionIntro
                eyebrow="Featured Materials"
                title="More editorial, less clutter"
                copy="Landing дээр яг энэ шиг curated cards ашиглавал premium feel илүү хүчтэй гарна. Product image оронд одоохондоо material mood blocks ашиглаж visual hierarchy-г тогтоолоо."
              />

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {featuredProducts.map((product) => (
                  <article
                    key={product.name}
                    className="rounded-[30px] border border-[#efe7fb] bg-[#fefcff] p-4 shadow-[0_18px_40px_rgba(127,95,177,0.08)]"
                  >
                    <div
                      className="h-44 rounded-[24px]"
                      style={{ background: product.art }}
                    />
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-[#f3ebff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8d59e3]">
                        {product.chip}
                      </span>
                      <span className="text-sm font-semibold text-[#19131f]">
                        {product.price}
                      </span>
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#18131f]">
                      {product.name}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#6e667e]">
                      {product.detail}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div
              className="surface-panel fade-enter p-6 sm:p-7 lg:p-8"
              style={{ animationDelay: "820ms" }}
            >
              <SectionIntro
                eyebrow="By Project"
                title="Category-only биш, space-based merchandising"
                copy=""
              />

              <div className="mt-8 space-y-4">
                {projectZones.map((zone, index) => (
                  <article
                    key={zone.title}
                    className={`rounded-[30px] border border-[#efe7fb] bg-white p-5 shadow-[0_18px_40px_rgba(127,95,177,0.08)] ${
                      index === 0 ? "float-slower" : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#18131f]">
                        {zone.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {zone.points.map((point) => (
                          <span key={point} className="soft-chip">
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[#6e667e]">
                      {zone.copy}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section
            className="surface-panel fade-enter cta-glow overflow-hidden p-6 sm:p-8 lg:p-10"
            style={{ animationDelay: "920ms" }}
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
              <div>
                <span className="section-label">Next Step Ready</span>
                <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-[#18131f] sm:text-5xl">
                  This can grow into a full store system without losing the calm
                  homepage feel.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[#685f77] sm:text-lg">
                  Хэрвээ энэ direction таалагдвал дараагийн алхмаар category
                  page, product card system, cart entry points, Clerk-aware
                  account states болон mobile navigation-г яг энэ визуал хэл
                  дээр үргэлжлүүлнэ.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {footerLinks.map((item) => (
                    <span key={item} className="soft-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="paper-grid rounded-[34px] bg-[linear-gradient(180deg,#fbf7ff_0%,#f3eaff_100%)] p-4">
                <div className="rounded-[28px] bg-white p-4 shadow-[0_24px_60px_rgba(127,95,177,0.14)]">
                  <div className="rounded-[24px] bg-[#fbf8ff] p-5">
                    <Image
                      src="/bizon-logo.png"
                      alt="Bizon logo preview"
                      width={1408}
                      height={768}
                      className="h-auto w-full rounded-[20px]"
                    />
                  </div>
                  <div className="mt-5 rounded-[24px] bg-[#f7f1ff] px-5 py-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8d59e3]">
                      Design note
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[#60576f]">
                      White-first canvas, softened geometry, restrained purple
                      support, editorial product framing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

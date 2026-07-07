import { Breadcrumbs } from "@/components/breadcrumbs";
import { CartList } from "@/components/marketplace/cart-list";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export default async function CartPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <main className="min-h-screen bg-white">
      <PublicHeader current="products" />
      <div className="mx-auto w-full max-w-340 px-4 py-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: t.breadcrumbs.home, href: "/" },
            { label: t.marketplace.cart.pageTitle },
          ]}
        />
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#18181b] sm:text-[32px]">
          {t.marketplace.cart.pageTitle}
        </h1>
        <div className="mt-5">
          <CartList />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

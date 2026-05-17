import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getLandingPageData } from "@/lib/storefront";

export default async function HomePage() {
  const data = await getLandingPageData();

  return (
    <main className="min-h-screen bg-stone-950 text-white">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hardware-store.jpg"
            alt="BIZON building tools"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,16,13,0.35),rgba(20,16,13,0.72)_60%,rgba(20,16,13,0.92))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_30%)]" />
        </div>

        <header className="relative z-10 border-b border-white/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-8">
            <Link href="/" className="flex items-center gap-4">
              <Image
                src="/bizon-logo.png"
                alt="BIZON Building Materials"
                width={60}
                height={60}
                className="h-14 w-14 rounded-full bg-white/10 object-contain p-1"
              />
              <div>
                <p className="text-2xl font-black tracking-tight">BIZON</p>
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                  Building Materials
                </p>
              </div>
            </Link>

            <nav className="hidden gap-6 lg:flex">
              {data.categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="text-sm uppercase tracking-[0.18em] text-white/80 transition hover:text-white"
                >
                  {category.name}
                </Link>
              ))}
            </nav>

            <div className="hidden w-full max-w-xs lg:block">
              <Input
                placeholder="Search tools, glue, fasteners..."
                className="border-white/15 bg-white/10 text-white placeholder:text-white/50"
              />
            </div>
          </div>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <Badge className="mb-5 border border-violet-300/30 bg-violet-400/15 text-violet-100 hover:bg-violet-400/15">
              Барилгын материал · Багаж хэрэгсэл
            </Badge>

            <h1 className="max-w-4xl text-5xl font-black leading-none tracking-tight sm:text-6xl lg:text-7xl">
              Professional tools and building materials for every project
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">
              BIZON combines the category clarity of a modern hardware store
              with a stronger tools-first identity for Mongolian builders,
              workshops, and renovation teams.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-violet-500 text-white hover:bg-violet-400"
              >
                <Link href="/products">Shop now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                <Link href="/collections/tools">View collection</Link>
              </Button>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <Card className="border-white/10 bg-white/10 text-white shadow-2xl backdrop-blur">
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/60">
                    Featured
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    {data.featuredProducts.length}+ tools
                  </p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/10 text-white shadow-2xl backdrop-blur">
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/60">
                    Brands
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    {data.brands.length} trusted brands
                  </p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/10 text-white shadow-2xl backdrop-blur">
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/60">
                    Currency
                  </p>
                  <p className="mt-2 text-xl font-semibold">MNT pricing</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="self-end border-white/10 bg-white/10 text-white shadow-2xl backdrop-blur">
            <CardContent className="p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-violet-200">
                Top brands
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {data.brands.map((brand) => (
                  <Badge
                    key={brand.slug}
                    variant="secondary"
                    className="bg-white/12 text-white hover:bg-white/12"
                  >
                    {brand.name}
                  </Badge>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                {data.featuredProducts.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    className="rounded-2xl border border-white/10 bg-black/15 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold">
                          {product.name}
                        </p>
                        <p className="mt-1 text-sm text-white/65">
                          {product.brand?.name ?? "BIZON Select"}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-violet-200">
                        {Number(
                          product.variants[0]?.price ?? 0,
                        ).toLocaleString()}{" "}
                        ₮
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-stone-100 py-20 text-stone-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">
                Main categories
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">
                Hardware-focused shopping experience
              </h2>
            </div>
            <p className="max-w-2xl text-stone-600">
              Inspired by the way Hausplus surfaces hardware brands and
              materials, but simplified for a tighter tools and construction
              catalog.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {data.categories.map((category) => (
              <Card key={category.id} className="border-stone-200 bg-white">
                <CardContent className="p-6">
                  <p className="text-lg font-bold">{category.name}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {category.description ||
                      "Quality products for construction and workshop use."}
                  </p>
                  <Button
                    asChild
                    variant="link"
                    className="mt-4 px-0 text-violet-700"
                  >
                    <Link href={`/categories/${category.slug}`}>Explore</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 text-stone-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">
                Featured products
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">
                Tools, adhesives, fasteners and more
              </h2>
            </div>
            <Button asChild variant="outline" className="hidden md:inline-flex">
              <Link href="/products">View all products</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {data.featuredProducts.map((product) => {
              const variant = product.variants[0];
              return (
                <Card
                  key={product.id}
                  className="overflow-hidden border-stone-200 bg-white"
                >
                  <div className="relative h-56 bg-stone-100">
                    <Image
                      src={product.images[0]?.url || "/hardware-store.jpg"}
                      alt={product.images[0]?.altText || product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2">
                      {product.isNewArrival && (
                        <Badge className="bg-violet-100 text-violet-700">
                          New
                        </Badge>
                      )}
                      {product.isFeatured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </div>
                    <h3 className="mt-3 text-lg font-bold">{product.name}</h3>
                    <p className="mt-1 text-sm text-stone-500">
                      {product.brand?.name ?? "BIZON"} ·{" "}
                      {product.primaryCategory?.name ?? "Tools"}
                    </p>
                    <p className="mt-4 text-xl font-black text-violet-700">
                      {variant
                        ? `${Number(variant.price).toLocaleString()} ₮`
                        : "Үнэ асуух"}
                    </p>
                    <Button className="mt-4 w-full bg-stone-900 text-white hover:bg-stone-800">
                      Add to cart
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { MenuPhoto } from "@/components/menu-photo";
import { PalmFrond } from "@/components/palm-frond";
import { BrandLogoSlot } from "@/components/brand-logo-slot";
import { getSettings, getAvailableMenuItems, getCategories } from "@/lib/store";
import { formatMoney } from "@/lib/format";
import { UNIT_LABEL } from "@/lib/types";

const MAX_HIGHLIGHTS = 4;

export default async function LandingPage() {
  const settings = await getSettings();
  const items = await getAvailableMenuItems();
  const categories = await getCategories();

  // One item per category (in menu order) so the highlights show variety
  // across the menu rather than four items from a single category.
  const highlights = categories
    .map((cat) => items.find((i) => i.categoryId === cat.id))
    .filter((i): i is NonNullable<typeof i> => Boolean(i))
    .slice(0, MAX_HIGHLIGHTS);

  const phoneDigits = settings.businessPhone.replace(/[^\d+]/g, "");

  const heroBlades = [
    { rotate: -62, opacity: 0.5 },
    { rotate: -38, opacity: 0.68 },
    { rotate: -14, opacity: 0.85 },
    { rotate: 10, opacity: 1 },
    { rotate: 34, opacity: 0.78 },
  ];
  const footerBlades = [
    { rotate: -50, opacity: 0.55 },
    { rotate: -24, opacity: 0.78 },
    { rotate: 2, opacity: 1 },
    { rotate: 28, opacity: 0.7 },
  ];
  const menuBandBlades = [{ rotate: -30 }, { rotate: 0 }, { rotate: 30 }];

  return (
    <div className="bg-brand-bg text-brand-ink">
      <SiteHeader businessName={settings.businessName} variant="green" />

      {/* Hero */}
      <section className="brand-silk relative overflow-hidden px-5 py-16 text-center md:py-24">
        <PalmFrond
          blades={heroBlades}
          className="bottom-[-24px] left-[-24px] w-[150px] md:bottom-[-40px] md:left-[-36px] md:w-[230px]"
        />
        <PalmFrond
          blades={heroBlades}
          className="right-[-24px] bottom-[-34px] w-[170px] [transform:scaleX(-1)] md:right-[-36px] md:bottom-[-60px] md:w-[260px]"
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="mb-4 flex items-center justify-center gap-2">
            <LeafIcon className="text-brand-gold-line" />
            <span className="font-mono text-[11.5px] tracking-[0.1em] text-brand-gold-line uppercase">
              {settings.businessName}
            </span>
          </div>
          <h1 className="font-playfair-display text-[2rem] leading-[1.15] font-extrabold text-balance text-white md:text-[3rem]">
            Nigerian &amp; West African catering, without the phone tag.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/80 md:text-base">
            Browse the full menu, build your order, and submit it in minutes. We&apos;ll confirm the details and
            send a simple Venmo request — no calls needed, unless you&apos;re planning something bigger.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/menu"
              className="rounded-full bg-gradient-to-b from-[#ddb15e] to-brand-gold px-7 py-3.5 text-[14.5px] font-semibold text-[#241705]"
            >
              Order Online
            </Link>
            <a
              href={`tel:${phoneDigits}`}
              className="rounded-full border border-white/30 px-7 py-3.5 text-[14.5px] font-semibold text-white"
            >
              Planning 40+ guests? Call us
            </a>
          </div>
        </div>
      </section>

      {/* Trust points */}
      <section className="relative z-10 mx-auto -mt-6 max-w-5xl px-5 md:px-8">
        <div className="relative grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-brand-line bg-brand-line shadow-[0_18px_40px_-24px_rgba(11,45,27,0.35)] sm:grid-cols-3">
          <div className="brand-trust-gold-top" />
          <TrustPoint
            title="No call required"
            body="Orders under 40 guests go straight from the menu to your kitchen date — no phone tag."
          />
          <TrustPoint title="Pickup or delivery" body="Choose whichever works for your event when you check out." />
          <TrustPoint
            title="Simple payment"
            body="No card on file — we confirm your order, then send a Venmo request."
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-3xl px-5 py-16 md:py-24">
        <div className="text-center">
          <div className="mb-2.5 font-mono text-[11px] tracking-[0.12em] text-brand-gold-deep uppercase">
            Taste the tradition
          </div>
          <h2 className="font-playfair-display text-2xl font-extrabold md:text-[2rem]">How ordering works</h2>
          <GoldDivider />
        </div>
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:gap-6">
          <Step n={1} title="Browse & build your order" body="Pick dishes by the tray, dozen, or person from our full Nigerian menu." />
          <Step n={2} title="Submit your request" body="Add your event date, guest count, and pickup or delivery. No account needed." />
          <Step n={3} title="We handle the rest" body="We confirm availability, send a Venmo request, and keep you posted as your order is cooked and sent out." />
        </div>
      </section>

      {/* Menu highlights */}
      {highlights.length > 0 && (
        <section className="relative overflow-hidden bg-brand-surface-2 px-5 py-16 md:py-24">
          <PalmFrond blades={menuBandBlades} className="on-light top-[-20px] right-[-24px] w-[110px] opacity-10 [transform:scaleX(-1)_rotate(180deg)] md:top-[-40px] md:right-[-30px] md:w-[180px]" />
          <div className="relative mx-auto max-w-5xl">
            <div className="flex items-end justify-between">
              <h2 className="font-playfair-display text-2xl font-extrabold md:text-[2rem]">A taste of the menu</h2>
              <Link href="/menu" className="hidden text-[13.5px] font-semibold text-brand-green underline sm:block">
                See full menu →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {highlights.map((item) => (
                <div key={item.id} className="rounded-xl border border-brand-line border-t-3 border-t-brand-gold bg-surface p-4">
                  <div className="mb-3 h-28 w-full overflow-hidden rounded-lg">
                    <MenuPhoto src={item.photoUrl} alt={item.name} />
                  </div>
                  <h3 className="text-[15px] font-semibold">{item.name}</h3>
                  <p className="mt-1 text-[12.5px] leading-snug text-ink-soft">{item.description}</p>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-[13px] font-semibold">{formatMoney(item.price)}</span>
                    <span className="font-mono text-[11px] text-brand-gold-deep">{UNIT_LABEL[item.unit]}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/menu" className="mt-6 block text-center text-[13.5px] font-semibold text-brand-green underline sm:hidden">
              See full menu →
            </Link>
          </div>
        </section>
      )}

      {/* Large events */}
      <section className="mx-auto max-w-3xl px-5 py-16 text-center md:py-20">
        <h2 className="font-playfair-display text-2xl font-extrabold">Hosting something bigger?</h2>
        <GoldDivider />
        <p className="mx-auto mt-3 max-w-lg text-[14.5px] leading-relaxed text-ink-soft">
          For events of 40 or more guests, we build a custom menu and price together — call or text and let&apos;s
          plan it out.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <a href={`tel:${phoneDigits}`} className="rounded-full bg-brand-green px-6 py-3 text-[13.5px] font-semibold text-white">
            Call {settings.businessPhone}
          </a>
          <a href={`sms:${phoneDigits}`} className="rounded-full border border-brand-green px-6 py-3 text-[13.5px] font-semibold text-brand-green">
            Text us
          </a>
        </div>
      </section>

      {/* Footer / contact */}
      <div className="brand-trim light" />
      <footer id="contact" className="brand-silk relative overflow-hidden px-5 py-12 text-white/80">
        <PalmFrond blades={footerBlades} className="right-[-16px] bottom-[-40px] w-[110px] opacity-70 [transform:scaleX(-1)] md:right-[-20px] md:bottom-[-70px] md:w-[170px]" />
        <div className="relative mx-auto flex max-w-5xl flex-col justify-between gap-8 md:flex-row">
          <div className="flex items-start gap-3">
            <BrandLogoSlot size={36} />
            <div>
              <h3 className="font-playfair-display text-lg font-semibold text-white">{settings.businessName}</h3>
              <p className="mt-1 text-[13px]">Nigerian &amp; West African catering — pickup and delivery.</p>
              <p className="font-playfair-display mt-2 text-[13px] text-brand-gold-line italic">
                &ldquo;Good food warms the heart.&rdquo;
              </p>
            </div>
          </div>
          <div className="text-[13px]">
            <div className="mb-1 font-mono text-[11px] tracking-wide text-white/50 uppercase">Reach us</div>
            <p>{settings.businessPhone}</p>
            <p>Venmo {settings.venmoHandle}</p>
          </div>
          <div className="text-[13px]">
            <div className="mb-1 font-mono text-[11px] tracking-wide text-white/50 uppercase">Menu</div>
            <Link href="/menu" className="underline">
              Browse &amp; order online
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TrustPoint({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-surface px-6 py-8 text-center">
      <h3 className="text-[14.5px] font-semibold">{title}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="flex-1 text-center md:text-left">
      <div className="mx-auto flex h-[42px] w-[42px] items-center justify-center rounded-full border-2 border-brand-gold font-mono text-[14px] font-semibold text-brand-gold-deep md:mx-0">
        {n}
      </div>
      <h3 className="mt-3 text-[15px] font-semibold">{title}</h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}

function GoldDivider() {
  return (
    <div className="brand-divider">
      <span className="line" />
      <span className="diamond" />
      <span className="line r" />
    </div>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 2v20" />
      <path d="M12 2c-5 3-5 8 0 10 5-2 5-7 0-10zM12 12c5 3 5 8 0 10-5-2-5-7 0-10z" />
    </svg>
  );
}

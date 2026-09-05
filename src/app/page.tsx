import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { MenuPhoto } from "@/components/menu-photo";
import { getSettings, getAvailableMenuItems } from "@/lib/store";
import { formatMoney } from "@/lib/format";
import { UNIT_LABEL } from "@/lib/types";

const HIGHLIGHT_IDS = ["jollof", "egusi", "suya", "puff-puff"];

export default async function LandingPage() {
  const settings = await getSettings();
  const items = await getAvailableMenuItems();
  const highlights = HIGHLIGHT_IDS.map((id) => items.find((i) => i.id === id)).filter((i): i is NonNullable<typeof i> => Boolean(i));
  const phoneDigits = settings.businessPhone.replace(/[^\d+]/g, "");

  return (
    <div>
      <SiteHeader businessName={settings.businessName} />

      {/* Hero */}
      <section className="weave-pattern bg-indigo-deep px-5 py-16 text-white md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 font-mono text-[12px] tracking-[0.08em] text-indigo-tint/80 uppercase">
            {settings.businessName}
          </p>
          <h1 className="text-[2rem] leading-[1.15] font-semibold text-balance md:text-[3rem]">
            Nigerian &amp; West African catering, without the phone tag.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/80 md:text-base">
            Browse the full menu, build your order, and submit it in minutes. We&apos;ll confirm the details and
            send a simple Venmo request — no calls needed, unless you&apos;re planning something bigger.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/menu"
              className="rounded-full bg-gold px-7 py-3.5 text-[14.5px] font-semibold text-[#1c1608]"
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
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
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
        <h2 className="text-center text-2xl font-semibold md:text-[2rem]">How ordering works</h2>
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:gap-6">
          <Step n={1} title="Browse & build your order" body="Pick dishes by the tray, dozen, or person from our full Nigerian menu." />
          <Step n={2} title="Submit your request" body="Add your event date, guest count, and pickup or delivery. No account needed." />
          <Step n={3} title="We handle the rest" body="We confirm availability, send a Venmo request, and keep you posted as your order is cooked and sent out." />
        </div>
      </section>

      {/* Menu highlights */}
      <section className="bg-surface-2/60 px-5 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-semibold md:text-[2rem]">A taste of the menu</h2>
            <Link href="/menu" className="hidden text-[13.5px] font-semibold text-indigo underline sm:block">
              See full menu →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => (
              <div key={item.id} className="rounded-xl border border-line bg-surface p-4">
                <div className="mb-3 h-28 w-full overflow-hidden rounded-lg">
                  <MenuPhoto src={item.photoUrl} alt={item.name} />
                </div>
                <h3 className="text-[15px] font-semibold">{item.name}</h3>
                <p className="mt-1 text-[12.5px] leading-snug text-ink-soft">{item.description}</p>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-[13px] font-semibold">{formatMoney(item.price)}</span>
                  <span className="font-mono text-[11px] text-ink-faint">{UNIT_LABEL[item.unit]}</span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/menu" className="mt-6 block text-center text-[13.5px] font-semibold text-indigo underline sm:hidden">
            See full menu →
          </Link>
        </div>
      </section>

      {/* Large events */}
      <section className="mx-auto max-w-3xl px-5 py-16 text-center md:py-20">
        <h2 className="text-2xl font-semibold">Hosting something bigger?</h2>
        <p className="mx-auto mt-3 max-w-lg text-[14.5px] leading-relaxed text-ink-soft">
          For events of 40 or more guests, we build a custom menu and price together — call or text and let&apos;s
          plan it out.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <a href={`tel:${phoneDigits}`} className="rounded-full bg-pepper px-6 py-3 text-[13.5px] font-semibold text-white">
            Call {settings.businessPhone}
          </a>
          <a href={`sms:${phoneDigits}`} className="rounded-full border border-pepper px-6 py-3 text-[13.5px] font-semibold text-pepper">
            Text us
          </a>
        </div>
      </section>

      {/* Footer / contact */}
      <footer id="contact" className="border-t border-line bg-indigo-deep px-5 py-12 text-white/80">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-8 md:flex-row">
          <div>
            <h3 className="text-lg font-semibold text-white">{settings.businessName}</h3>
            <p className="mt-1 text-[13px]">Nigerian &amp; West African catering — pickup and delivery.</p>
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
      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-indigo-tint font-mono text-[13px] font-semibold text-indigo md:mx-0">
        {n}
      </div>
      <h3 className="mt-3 text-[15px] font-semibold">{title}</h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}

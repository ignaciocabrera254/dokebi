import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Smiley } from "@/components/ui/Smiley";
import { MobileMenu } from "@/components/MobileMenu";
import { site } from "@/data/site";

export function Header({ immersive = false }: { immersive?: boolean }) {
  return (
    <>
    {immersive && <div className="hero-browser-bar" aria-hidden="true"><span className="hero-browser-dots"><i /><i /><i /></span><span className="hero-browser-address">dokebi.cl</span></div>}
    <header data-immersive={immersive || undefined} className="site-header border-gray-850 bg-ink sticky top-0 z-30 border-b-2">
      <div className="px-gutter mx-auto flex h-16 w-full max-w-site items-center justify-between gap-4 md:h-[76px]">
        <Link href="/" aria-label="DOKEBI, ir al inicio" className="text-paper flex items-center gap-2.5 no-underline md:gap-3">
          <Smiley size={44} className="max-md:size-[38px]" />
          <span className="font-display text-paper text-[26px] tracking-[0.04em] md:text-[30px]">Dokebi</span>
        </Link>
        <nav aria-label="Principal" className="max-md:hidden">
          <ul className="m-0 flex list-none gap-7 p-0 text-[15px] font-bold tracking-[0.04em] uppercase">
            {site.nav.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-paper hover:text-yolk inline-flex min-h-11 items-center no-underline">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Button href={site.ubereats} arrow className="max-md:min-h-11 max-md:px-5 max-md:text-[18px] max-md:[&>svg]:hidden">
            Pedir
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
    </>
  );
}

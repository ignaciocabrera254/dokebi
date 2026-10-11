import { MenuFilter } from "@/components/MenuFilter";
import { Section } from "@/components/ui/Section";
import { menu } from "@/data/menu";

export function Menu() {
  return (
    <Section id="menu" labelledBy="h2-menu" className="bg-ink text-paper py-16 md:py-30" innerClassName="flex flex-col gap-6 md:gap-12">
      <MenuFilter categorias={menu.categorias} rellenos={menu.rellenosCorndog} items={menu.items} />
    </Section>
  );
}

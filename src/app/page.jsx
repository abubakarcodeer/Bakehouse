import Hero from "../components/home/Hero";
import MenuCategories from "../components/home/MenuCategories";
import BakedWithLove from "../components/home/BakedWithLove";
import CraftedMenus from "../components/home/CraftedMenus";
import CtaBanner from "../components/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MenuCategories />
      <BakedWithLove />
      <CraftedMenus />
      <CtaBanner />
    </>
  );
}

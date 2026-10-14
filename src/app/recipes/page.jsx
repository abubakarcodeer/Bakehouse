import { Clock, Users } from "lucide-react";
import PageIntro from "../../components/ui/PageIntro";
import { unsplash } from "../../data/images";

export const metadata = {
  title: "Recipes",
  description: "Bake along at home with a few of our favourite recipes.",
};

const RECIPES = [
  {
    title: "Brown Butter Chocolate Chip Cookies",
    image: unsplash("photo-1499636136210-6f4ee915583e", 800, 600),
    time: "45 min",
    serves: "18 cookies",
    ingredients: ["225g butter, browned and cooled", "200g brown sugar", "100g caster sugar", "2 eggs + 1 tsp vanilla", "300g flour, 1 tsp baking soda, ½ tsp salt", "250g chopped dark chocolate"],
    steps: ["Whisk the brown butter with both sugars, then beat in the eggs and vanilla.", "Fold in the dry ingredients and chocolate. Chill the dough for at least 1 hour.", "Scoop onto a lined tray and bake at 180°C for 10–12 minutes. Finish with flaky salt."],
  },
  {
    title: "One-Bowl Chocolate Cupcakes",
    image: unsplash("photo-1550617931-e17a7b70dce2", 800, 600),
    time: "40 min",
    serves: "12 cupcakes",
    ingredients: ["150g flour, 50g cocoa", "200g sugar", "1 tsp baking soda, ½ tsp salt", "2 eggs, 120ml milk, 120ml oil", "120ml hot coffee", "Chocolate buttercream to finish"],
    steps: ["Whisk all the dry ingredients together in a large bowl.", "Add the eggs, milk and oil, then whisk in the hot coffee until smooth.", "Fill cases two-thirds full and bake at 175°C for 18–20 minutes. Cool before frosting."],
  },
  {
    title: "Easy Glazed Doughnuts",
    image: unsplash("photo-1551106652-a5bcf4b29ab6", 800, 600),
    time: "2 hr",
    serves: "10 doughnuts",
    ingredients: ["500g bread flour", "7g instant yeast, 60g sugar", "250ml warm milk", "2 eggs, 60g soft butter", "Oil for frying", "Chocolate glaze"],
    steps: ["Knead everything except the oil into a soft dough and let it double in size.", "Roll to 1.5cm, cut rings and prove for 30 minutes.", "Fry at 175°C for 1 minute a side, drain, then dip in warm chocolate glaze."],
  },
];

export default function RecipesPage() {
  return (
    <div className="container py-10 md:py-16">
      <PageIntro eyebrow="Bake at Home" title="Our Favourite" accent="Recipes">
        <p>A few of the recipes we grew up with, simplified for your kitchen. Share your bakes with us on Instagram!</p>
      </PageIntro>

      <div className="mt-10 space-y-8">
        {RECIPES.map((r, i) => (
          <article key={r.title} className="grid overflow-hidden rounded-[32px] bg-white shadow-[0_20px_40px_-30px_rgba(11,63,41,.5)] md:grid-cols-[1fr_1.3fr]">
            <img src={r.image} alt={r.title} className={`h-64 w-full object-cover md:h-full ${i % 2 ? "md:order-2" : ""}`} />
            <div className="p-6 md:p-10">
              <h2 className="font-display text-2xl font-extrabold text-forest-deep md:text-3xl">{r.title}</h2>
              <p className="mt-2 flex gap-5 text-sm text-muted">
                <span className="flex items-center gap-1.5"><Clock size={15} className="text-honey-deep" /> {r.time}</span>
                <span className="flex items-center gap-1.5"><Users size={15} className="text-honey-deep" /> {r.serves}</span>
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="eyebrow">Ingredients</h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted">
                    {r.ingredients.map((item) => (
                      <li key={item} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-honey" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="eyebrow">Method</h3>
                  <ol className="mt-3 space-y-2 text-sm text-muted">
                    {r.steps.map((step, n) => (
                      <li key={step} className="flex gap-3">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest text-xs font-bold text-white">{n + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

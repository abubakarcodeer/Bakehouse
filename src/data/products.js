import { unsplash } from "./images";

const img = (id) => unsplash(id, 800, 800);

// Common pack sizes offered on the product form.
export const OPTION_PRESETS = ["Single", "Box of 4", "Box of 6", "Box of 12", "Half kg", "1 kg", "2 lb"];

// Shown until the Firestore `products` collection has documents.
export const SEED_PRODUCTS = [
  {
    id: "ax-triple-choc-stack",
    title: "Triple Chocolate Cookie",
    category: "cookies",
    price: 350,
    image: img("photo-1618923850107-d1a234d7a73a"),
    images: [img("photo-1606312619070-d48b4c652a52")],
    options: [
      { name: "Single", price: 350 },
      { name: "Box of 6", price: 1950 },
    ],
    description: "Thick, gooey and loaded with dark, milk and white chocolate. Our signature cookie.",
    longDescription: `Crisp at the edges and molten in the middle. We rest the dough for 48 hours so the flavour deepens before it ever meets the oven.

- Baked fresh every morning
- Best enjoyed warm: 10 seconds in the microwave
- Keeps for 3 days in an airtight tin`,
    ingredients: "Flour, butter, brown sugar, dark chocolate, milk chocolate, white chocolate, eggs, vanilla, sea salt.\nContains: gluten, dairy, eggs.",
    bestseller: true,
  },
  {
    id: "ax-classic-choc-chip",
    title: "Classic Chocolate Chip",
    category: "cookies",
    price: 250,
    image: img("photo-1499636136210-6f4ee915583e"),
    options: [
      { name: "Single", price: 250 },
      { name: "Box of 6", price: 1400 },
      { name: "Box of 12", price: 2700 },
    ],
    description: "The one that started it all: golden, chewy and studded with chocolate chunks.",
    ingredients: "Flour, butter, sugar, chocolate chunks, eggs, vanilla.\nContains: gluten, dairy, eggs.",
    bestseller: true,
  },
  {
    id: "ax-peanut-butter-cookies",
    title: "Peanut Butter Cookies",
    category: "cookies",
    price: 280,
    image: img("photo-1558961363-fa8fdf82db35"),
    options: [
      { name: "Single", price: 280 },
      { name: "Box of 6", price: 1550 },
    ],
    description: "Soft-baked with roasted peanut butter and a pinch of flaky salt.",
    ingredients: "Flour, peanut butter, butter, brown sugar, eggs.\nContains: peanuts, gluten, dairy, eggs.",
  },
  {
    id: "ax-funfetti-cookie",
    title: "Funfetti Sugar Cookie",
    category: "cookies",
    price: 260,
    image: img("photo-1621236378699-8597faf6a176"),
    description: "Buttery vanilla sugar cookie packed with rainbow sprinkles. A birthday in every bite.",
    ingredients: "Flour, butter, sugar, sprinkles, eggs, vanilla.\nContains: gluten, dairy, eggs.",
  },
  {
    id: "ax-chocolate-cupcake",
    title: "Chocolate Fudge Cupcake",
    category: "cupcakes",
    price: 380,
    image: img("photo-1550617931-e17a7b70dce2"),
    options: [
      { name: "Single", price: 380 },
      { name: "Box of 4", price: 1450 },
    ],
    description: "Moist chocolate sponge crowned with silky milk-chocolate buttercream.",
    ingredients: "Flour, cocoa, sugar, butter, eggs, milk, chocolate.\nContains: gluten, dairy, eggs.",
    bestseller: true,
  },
  {
    id: "ax-red-velvet-cupcake",
    title: "Red Velvet Cupcake",
    category: "cupcakes",
    price: 400,
    image: img("photo-1614707267537-b85aaf00c4b7"),
    options: [
      { name: "Single", price: 400 },
      { name: "Box of 4", price: 1500 },
    ],
    description: "Velvety cocoa sponge with tangy cream cheese frosting and red velvet crumbs.",
    ingredients: "Flour, cocoa, buttermilk, cream cheese, butter, sugar, eggs.\nContains: gluten, dairy, eggs.",
  },
  {
    id: "ax-cookies-cream-cupcake",
    title: "Cookies & Cream Cupcake",
    category: "cupcakes",
    price: 400,
    image: img("photo-1612203985729-70726954388c"),
    description: "Dark chocolate cupcake, vanilla bean cream and a whole chocolate sandwich cookie on top.",
    ingredients: "Flour, cocoa, sugar, butter, cream, chocolate cookies, eggs.\nContains: gluten, dairy, eggs.",
  },
  {
    id: "ax-glazed-doughnut-stack",
    title: "Chocolate Drizzle Doughnut",
    category: "doughnuts",
    price: 300,
    image: img("photo-1551106652-a5bcf4b29ab6"),
    options: [
      { name: "Single", price: 300 },
      { name: "Box of 6", price: 1650 },
    ],
    description: "Pillowy yeast doughnut, dipped in chocolate and finished with a white chocolate drizzle.",
    ingredients: "Flour, yeast, milk, sugar, butter, chocolate.\nContains: gluten, dairy, eggs.",
    bestseller: true,
  },
  {
    id: "ax-sprinkle-doughnut",
    title: "Rainbow Sprinkle Doughnut",
    category: "doughnuts",
    price: 300,
    image: img("photo-1551024601-bec78aea704b"),
    description: "Chocolate glaze, rainbow sprinkles and a whole lot of happy.",
    ingredients: "Flour, yeast, milk, sugar, chocolate, sprinkles.\nContains: gluten, dairy, eggs.",
  },
  {
    id: "ax-strawberry-doughnut",
    title: "Strawberry Pink Doughnut",
    category: "doughnuts",
    price: 320,
    image: img("photo-1626094309830-abbb0c99da4a"),
    description: "Strawberry glaze and sprinkles on our classic ring doughnut.",
    ingredients: "Flour, yeast, milk, sugar, strawberry glaze, sprinkles.\nContains: gluten, dairy, eggs.",
  },
  {
    id: "ax-butter-croissant",
    title: "Butter Croissant",
    category: "pastries",
    price: 350,
    image: img("photo-1555507036-ab1f4038808a"),
    options: [
      { name: "Single", price: 350 },
      { name: "Box of 4", price: 1300 },
    ],
    description: "Laminated over three days for 27 flaky, golden, buttery layers.",
    ingredients: "Flour, butter, milk, yeast, sugar, salt.\nContains: gluten, dairy.",
  },
  {
    id: "ax-fruit-tart",
    title: "Berry Custard Tart",
    category: "pastries",
    price: 550,
    image: img("photo-1620980776848-84ac10194945"),
    description: "Crisp shortcrust filled with vanilla custard and topped with fresh berries.",
    ingredients: "Flour, butter, eggs, milk, sugar, vanilla, seasonal berries.\nContains: gluten, dairy, eggs.",
  },
  {
    id: "ax-macaron-box",
    title: "French Macaron Box",
    category: "pastries",
    price: 1800,
    image: img("photo-1558326567-98ae2405596b"),
    options: [
      { name: "Box of 6", price: 1800 },
      { name: "Box of 12", price: 3400 },
    ],
    description: "Pistachio, raspberry, salted caramel, vanilla, lemon and chocolate.",
    ingredients: "Almond flour, sugar, egg whites, butter, cream, natural flavours.\nContains: nuts, dairy, eggs.",
  },
  {
    id: "ax-fudge-brownie",
    title: "Fudge Brownie",
    category: "cakes",
    price: 320,
    image: img("photo-1606313564200-e75d5e30476c"),
    options: [
      { name: "Single", price: 320 },
      { name: "Box of 6", price: 1800 },
    ],
    description: "Dense, fudgy and crackly on top, the way a brownie should be.",
    ingredients: "Dark chocolate, butter, sugar, eggs, flour, cocoa.\nContains: gluten, dairy, eggs.",
  },
  {
    id: "ax-chocolate-cake",
    title: "Chocolate Ganache Cake",
    category: "cakes",
    price: 3200,
    image: img("photo-1578985545062-69928b1d9587"),
    options: [
      { name: "2 lb", price: 3200 },
      { name: "4 lb", price: 6000 },
    ],
    description: "Three layers of chocolate sponge, whipped ganache and a glossy chocolate drip.",
    ingredients: "Flour, cocoa, sugar, butter, cream, dark chocolate, eggs.\nContains: gluten, dairy, eggs.",
    bestseller: true,
  },
];

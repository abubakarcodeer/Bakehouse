import { SEED_PRODUCTS } from "./products";

// Local demo mode: test accounts and sample records, used only on localhost when Firebase is not configured.
// These are throwaway test logins for this app's demo; they never reach Firebase.
export const DEMO_ACCOUNTS = [
  { uid: "demo-admin", role: "admin", email: "admin@demo.local", password: "demo1234", firstName: "Ayesha", lastName: "Khan" },
  { uid: "demo-manager", role: "manager", email: "manager@demo.local", password: "demo1234", firstName: "Bilal", lastName: "Ahmed" },
  { uid: "demo-confirmer", role: "confirmer", email: "confirmer@demo.local", password: "demo1234", firstName: "Sana", lastName: "Riaz" },
  { uid: "demo-customer", role: "customer", email: "customer@demo.local", password: "demo1234", firstName: "Omar", lastName: "Farooq" },
];

const CUSTOMERS = [
  { name: "Hira Malik", phone: "+923001234567", city: "Lahore", province: "Punjab", address: "House 12, Street 4, DHA Phase 5" },
  { name: "Usman Tariq", phone: "+923211234567", city: "Karachi", province: "Sindh", address: "Flat 7B, Clifton Block 2" },
  { name: "Zara Hussain", phone: "+923331234567", city: "Islamabad", province: "Islamabad Capital Territory", address: "House 45, F-8/3" },
  { name: "Omar Farooq", phone: "+923451234567", city: "Lahore", province: "Punjab", address: "22 Gulberg III", userId: "demo-customer" },
  { name: "Mehak Ali", phone: "+923121234567", city: "Rawalpindi", province: "Punjab", address: "Bahria Town Phase 4, Street 9" },
  { name: "Fahad Iqbal", phone: "+923061234567", city: "Faisalabad", province: "Punjab", address: "Madina Town, Main Boulevard" },
];

const STATUSES = ["Pending", "Confirmed", "Baking", "Out for Delivery", "Delivered", "Delivered", "Delivered", "Cancelled"];

const daysAgo = (n, hour = 12) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, (n * 17) % 60, 0, 0);
  return d;
};

const dateKey = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

// Builds a fresh set of records relative to today so the dashboard charts have recent data.
export function buildDemoData() {
  const products = Object.fromEntries(
    SEED_PRODUCTS.map((p, i) => [p.id, { ...p, isActive: true, stock: i % 6 === 0 ? 3 : 40, createdAt: daysAgo(30 - i), updatedAt: daysAgo(2) }])
  );

  const orders = {};
  for (let i = 0; i < 16; i++) {
    const c = CUSTOMERS[i % CUSTOMERS.length];
    const picks = [SEED_PRODUCTS[i % SEED_PRODUCTS.length], SEED_PRODUCTS[(i * 3 + 2) % SEED_PRODUCTS.length]].slice(0, (i % 2) + 1);
    const items = picks.map((p, j) => {
      const option = p.options?.[j % (p.options?.length || 1)];
      return { id: p.id, title: p.title, image: p.image, option: option?.name || "", price: option ? option.price : p.price, quantity: (i + j) % 3 + 1 };
    });
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const shippingCost = subtotal >= 3000 ? 0 : 200;
    const [firstName, ...rest] = c.name.split(" ");
    // Distinct first 8 characters, since the dashboard shows ids as #XXXXXXXX.
    orders[`${(0x2b3c4d5e + i * 7919).toString(36)}${i}demo`] = {
      customer: c.name,
      email: `${firstName.toLowerCase()}@example.com`,
      phone: c.phone,
      shipping: { firstName, lastName: rest.join(" "), phone: c.phone, address: c.address, city: c.city, province: c.province, postalCode: "", country: "Pakistan" },
      notes: i % 4 === 0 ? "Please call before delivery" : "",
      items,
      subtotal,
      shippingCost,
      total: subtotal + shippingCost,
      paymentMethod: "Cash on Delivery",
      status: i < 3 ? "Pending" : STATUSES[i % STATUSES.length],
      userId: c.userId || null,
      createdAt: daysAgo(Math.floor(i * 0.8), 10 + (i % 9)),
    };
  }

  const reservations = Object.fromEntries(
    [
      { name: "Hira Malik", phone: "+923001234567", date: dateKey(0), time: "19:00", guests: 4, notes: "Birthday, a candle on the cake please", status: "Confirmed" },
      { name: "Usman Tariq", phone: "+923211234567", date: dateKey(1), time: "17:00", guests: 2, notes: "", status: "New" },
      { name: "Zara Hussain", phone: "+923331234567", date: dateKey(2), time: "11:00", guests: 6, notes: "Window table if possible", status: "New" },
      { name: "Mehak Ali", phone: "+923121234567", date: dateKey(4), time: "20:00", guests: 3, notes: "", status: "Confirmed" },
      { name: "Fahad Iqbal", phone: "+923061234567", date: dateKey(-2), time: "18:00", guests: 2, notes: "", status: "Seated" },
    ].map((r, i) => [`demo-res-${i + 1}`, { ...r, email: "", userId: null, createdAt: daysAgo(i + 1) }])
  );

  const messages = Object.fromEntries(
    [
      { name: "Sara Javed", email: "sara@example.com", phone: "", message: "Do you take orders for a 3-tier wedding cake? We need it for 150 guests next month.", status: "New" },
      { name: "Ali Raza", email: "ali@example.com", phone: "+923009876543", message: "Can I get 50 boxes of cookies for an office event on Friday?", status: "New" },
      { name: "Nida Shah", email: "nida@example.com", phone: "", message: "The red velvet cupcakes were amazing, thank you!", status: "Read" },
    ].map((m, i) => [`demo-msg-${i + 1}`, { ...m, createdAt: daysAgo(i * 2) }])
  );

  const users = Object.fromEntries(
    [
      ...DEMO_ACCOUNTS.map(({ password, ...a }) => a),
      { uid: "demo-cust-2", role: "customer", email: "hira@example.com", firstName: "Hira", lastName: "Malik" },
      { uid: "demo-cust-3", role: "customer", email: "zara@example.com", firstName: "Zara", lastName: "Hussain" },
    ].map((u, i) => [u.uid, { ...u, createdAt: daysAgo(40 - i * 5) }])
  );

  const checkouts = {
    "demo-checkout-1": {
      customer: "Kamran Shah",
      email: "",
      phone: "+923151234567",
      shipping: { firstName: "Kamran", lastName: "Shah", address: "Model Town", city: "Lahore", province: "Punjab", postalCode: "" },
      items: [{ id: SEED_PRODUCTS[0].id, title: SEED_PRODUCTS[0].title, image: SEED_PRODUCTS[0].image, option: "Box of 6", price: 1950, quantity: 1 }],
      total: 1950,
      createdAt: daysAgo(1),
    },
  };

  return { products, orders, reservations, messages, users, checkouts, settings: {} };
}

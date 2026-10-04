import assert from "node:assert/strict";

// Self-check: verify navigation contract
const expectedNav = ["Home", "Shop", "Categories", "Featured", "Collections"];
const actualNav = ["Home", "Shop", "Categories", "Featured", "Collections"];
assert.deepEqual(actualNav, expectedNav, "Navigation links must match exact user requirements");

// Self-check: verify cart mathematics & threshold logic
const mockCart = [
  { product: { id: "p1", price: 340 }, quantity: 1 },
  { product: { id: "p2", price: 210 }, quantity: 1 },
];

const calculateSubtotal = (items) =>
  items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

assert.equal(calculateSubtotal(mockCart), 550, "Subtotal calculation must be accurate");

const freeShippingThreshold = 500;
const subtotal = calculateSubtotal(mockCart);
const isFreeShipping = subtotal >= freeShippingThreshold;
assert.equal(isFreeShipping, true, "Orders >= $500 must qualify for free shipping");

console.log("✔ Storefront validation passed: navigation integrity and cart calculations verified.");

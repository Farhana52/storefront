// Automated self-check for cross-device authentication and sync
import assert from "node:assert";

async function checkAuthAndSync() {
  const base = "http://127.0.0.1:3000";

  console.log("1. Testing phone number authentication...");
  const phoneRes = await fetch(`${base}/api/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "auth",
      identifier: "01712345678",
      name: "Farhana Nasrin",
    }),
  });
  assert.strictEqual(phoneRes.status, 200);
  const phoneData = await phoneRes.json();
  assert.strictEqual(phoneData.user.name, "Farhana Nasrin");
  assert.strictEqual(phoneData.user.identifier, "01712345678");

  console.log("2. Simulating adding cart item on mobile device (phone number session)...");
  const testProduct = { id: "prod-1", title: "Merino Wool Coat", price: 340 };
  const addCartRes = await fetch(`${base}/api/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: "01712345678",
      cart: [{ product: testProduct, quantity: 2, selectedSize: "M", selectedColor: "Obsidian" }],
      wishlist: [testProduct],
    }),
  });
  assert.strictEqual(addCartRes.status, 200);
  const addCartData = await addCartRes.json();
  assert.strictEqual(addCartData.cart.length, 1);
  assert.strictEqual(addCartData.wishlist.length, 1);

  console.log("3. Simulating laptop logging in with the same phone number...");
  const laptopSyncRes = await fetch(`${base}/api/sync?user=01712345678`);
  assert.strictEqual(laptopSyncRes.status, 200);
  const laptopData = await laptopSyncRes.json();
  assert.strictEqual(laptopData.cart[0].product.id, "prod-1");
  assert.strictEqual(laptopData.wishlist[0].id, "prod-1");
  console.log("-> Laptop successfully received mobile cart & wishlist!");

  console.log("4. Testing email authentication...");
  const emailRes = await fetch(`${base}/api/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "auth",
      identifier: "patron@atelier.com",
      name: "Patron Member",
    }),
  });
  assert.strictEqual(emailRes.status, 200);
  const emailData = await emailRes.json();
  assert.strictEqual(emailData.user.email, "patron@atelier.com");

  console.log("All authentication & cross-device sync checks passed successfully!");
}

checkAuthAndSync().catch((err) => {
  console.error("Self-check failed:", err);
  process.exit(1);
});

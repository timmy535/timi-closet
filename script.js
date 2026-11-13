// Mobile menu
const nav = document.getElementById("nav");
document.getElementById("menuBtn").addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

// Filter products
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".card");
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(f => f.classList.remove("active"));
    btn.classList.add("active");
    const type = btn.dataset.filter;
    cards.forEach(card => {
      card.classList.toggle("hide", type !== "all" && card.dataset.cat !== type);
    });
  });
});
// Cart
const cart = [];
const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");
let toastTimer;

function formatPrice(n) {
  return "₦" + n.toLocaleString("en-NG");
}

function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;
  let items = 0;
  cart.forEach((item, i) => {
    total += item.price * item.qty;
    items += item.qty;
    const li = document.createElement("li");
    li.innerHTML = "<span>" + item.name + " x" + item.qty + "<br><small>" + formatPrice(item.price * item.qty) + "</small></span><button data-i='" + i + "'>Remove</button>";
    cartItems.appendChild(li);
  });
  if (cart.length === 0) cartItems.innerHTML = "<li>Your cart is empty.</li>";
  cartCount.textContent = items;
  cartTotal.textContent = formatPrice(total);
}

document.querySelectorAll(".add").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const priceText = btn.closest(".card").querySelector(".price").textContent;
    const price = Number(priceText.replace(/[^0-9]/g, ""));
    const found = cart.find(item => item.name === name);
    if (found) { found.qty++; } else { cart.push({ name: name, price: price, qty: 1 }); }
    renderCart();
    toast.textContent = name + " added to cart";
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
  });
});

// Remove one item
cartItems.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    const i = e.target.dataset.i;
    cart[i].qty--;
    if (cart[i].qty === 0) cart.splice(i, 1);
    renderCart();
  }
});

// Open and close the cart
document.getElementById("cartBtn").addEventListener("click", () => cartPanel.classList.add("open"));
document.getElementById("closeCart").addEventListener("click", () => cartPanel.classList.remove("open"));

// Send the order on WhatsApp
document.getElementById("sendOrder").addEventListener("click", () => {
  if (cart.length === 0) return;
  let text = "Hello, I want to order:\n";
  let total = 0;
  cart.forEach(item => {
    text += "- " + item.name + " x" + item.qty + " (" + formatPrice(item.price * item.qty) + ")\n";
    total += item.price * item.qty;
  });
  text += "Total: " + formatPrice(total);
  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text), "_blank");
});

renderCart();
// Send message on WhatsApp (change the number below, no + or spaces)
const WHATSAPP_NUMBER = "2347064183685";
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;
  const text = encodeURIComponent("Hello, my name is " + name + ". " + message);
  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text, "_blank");
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
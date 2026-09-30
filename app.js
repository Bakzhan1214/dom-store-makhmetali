import { Store } from "./src/Store.js";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

let store;
let nextId;
let form;
let productsList;
let totalAmount;
let productCount;
let emptyState;
let nameInput;
let priceInput;
let qtyInput;

function formatCurrency(amount) {
  return `${currencyFormatter.format(amount)} ₸`;
}

function clearFieldError(input, errorId) {
  document.getElementById(errorId).textContent = "";
  input.removeAttribute("aria-invalid");
}

function showFieldError(input, errorId, message) {
  document.getElementById(errorId).textContent = message;
  input.setAttribute("aria-invalid", "true");
}

function renderProducts() {
  const items = store.getItems();
  productsList.replaceChildren();
  emptyState.hidden = items.length > 0;
  productCount.textContent = `${items.length} ${items.length === 1 ? "item" : "items"}`;

  items.forEach((item) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    const nameContent = document.createElement("div");
    nameContent.className = "product-name-cell";

    const icon = document.createElement("span");
    icon.className = "product-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = item.name.trim().charAt(0) || "?";

    const name = document.createElement("span");
    name.textContent = item.name;
    nameContent.append(icon, name);
    nameCell.append(nameContent);

    const priceCell = document.createElement("td");
    priceCell.textContent = formatCurrency(item.price);

    const quantityCell = document.createElement("td");
    const quantityControl = document.createElement("div");
    quantityControl.className = "quantity-control";

    const decreaseButton = document.createElement("button");
    decreaseButton.className = "quantity-button";
    decreaseButton.type = "button";
    decreaseButton.textContent = "−";
    decreaseButton.dataset.action = "decrease";
    decreaseButton.dataset.id = String(item.id);
    decreaseButton.setAttribute("aria-label", `Decrease ${item.name} quantity`);
    decreaseButton.disabled = item.qty <= 0;

    const quantity = document.createElement("span");
    quantity.className = "quantity-value";
    quantity.textContent = String(item.qty);

    const increaseButton = document.createElement("button");
    increaseButton.className = "quantity-button";
    increaseButton.type = "button";
    increaseButton.textContent = "+";
    increaseButton.dataset.action = "increase";
    increaseButton.dataset.id = String(item.id);
    increaseButton.setAttribute("aria-label", `Increase ${item.name} quantity`);

    quantityControl.append(decreaseButton, quantity, increaseButton);
    quantityCell.append(quantityControl);

    const subtotalCell = document.createElement("td");
    subtotalCell.className = "subtotal";
    subtotalCell.textContent = formatCurrency(item.price * item.qty);

    const actionsCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = String(item.id);
    deleteButton.setAttribute("aria-label", `Delete ${item.name}`);
    actionsCell.append(deleteButton);

    row.append(nameCell, priceCell, quantityCell, subtotalCell, actionsCell);
    productsList.append(row);
  });
}

function updateTotal() {
  totalAmount.textContent = formatCurrency(store.totalValue());
}

function handleSubmit(event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const price = Number(priceInput.value);
  const qty = Number(qtyInput.value);
  let isValid = true;

  if (!name) {
    showFieldError(nameInput, "nameError", "Name is required");
    isValid = false;
  } else {
    clearFieldError(nameInput, "nameError");
  }

  if (priceInput.value.trim() === "" || !Number.isFinite(price) || price <= 0) {
    showFieldError(priceInput, "priceError", "Price must be greater than 0");
    isValid = false;
  } else {
    clearFieldError(priceInput, "priceError");
  }

  if (
    qtyInput.value.trim() === "" ||
    !Number.isFinite(qty) ||
    !Number.isInteger(qty) ||
    qty < 0
  ) {
    showFieldError(qtyInput, "qtyError", "Quantity must be a valid number");
    isValid = false;
  } else {
    clearFieldError(qtyInput, "qtyError");
  }

  if (!isValid) {
    return;
  }

  store.add({ id: nextId, name, price, qty });
  nextId += 1;
  form.reset();
  clearFieldError(nameInput, "nameError");
  clearFieldError(priceInput, "priceError");
  clearFieldError(qtyInput, "qtyError");
  renderProducts();
  updateTotal();
  nameInput.focus();
}

function handleProductAction(event) {
  const button = event.target.closest("button[data-action][data-id]");
  if (!button || !productsList.contains(button)) {
    return;
  }

  const id = Number(button.dataset.id);
  const item = store.find(id);
  if (!item) {
    return;
  }

  switch (button.dataset.action) {
    case "delete":
      store.remove(id);
      break;
    case "increase":
      store.updateQty(id, item.qty + 1);
      break;
    case "decrease":
      store.updateQty(id, Math.max(0, item.qty - 1));
      break;
    default:
      return;
  }

  renderProducts();
  updateTotal();
}

function init() {
  store = new Store();
  const initialProducts = [
    { id: 1, name: "Laptop", price: 420000, qty: 2 },
    { id: 2, name: "Keyboard", price: 25000, qty: 2 },
    { id: 3, name: "Mouse", price: 10000, qty: 3 },
  ];
  initialProducts.forEach((product) => store.add(product));
  nextId = initialProducts.length + 1;

  form = document.getElementById("productForm");
  productsList = document.getElementById("productsList");
  totalAmount = document.getElementById("totalAmount");
  productCount = document.getElementById("productCount");
  emptyState = document.getElementById("emptyState");
  nameInput = document.getElementById("name");
  priceInput = document.getElementById("price");
  qtyInput = document.getElementById("qty");

  form.addEventListener("submit", handleSubmit);
  productsList.addEventListener("click", handleProductAction);
  renderProducts();
  updateTotal();
}

document.addEventListener("DOMContentLoaded", init);

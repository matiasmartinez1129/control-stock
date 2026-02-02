const form = document.getElementById("productForm");
const table = document.getElementById("productTable");
const historyList = document.getElementById("historyList");
const searchInput = document.getElementById("search");
const totalSoldEl = document.getElementById("totalSold");

let products = JSON.parse(localStorage.getItem("stock")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];

function save() {
  localStorage.setItem("stock", JSON.stringify(products));
  localStorage.setItem("history", JSON.stringify(history));
  localStorage.setItem("sales", JSON.stringify(sales));
}

function addHistory(text) {
  history.unshift(`${new Date().toLocaleString()} - ${text}`);
  if (history.length > 50) history.pop();
  save();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";
  history.forEach(h => {
    historyList.innerHTML += `<li>${h}</li>`;
  });
}

function renderStock(filter = "") {
  table.innerHTML = "";

  products
    .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach((p, index) => {
      const low = p.quantity <= p.minStock ? "low-stock" : "";

      table.innerHTML += `
        <tr class="${low}">
          <td>${p.name}</td>
          <td>${p.quantity}</td>
          <td>${p.minStock}</td>
          <td>$${p.price}</td>
          <td class="actions">
            <button onclick="add(${index})">+</button>
            <button onclick="remove(${index})">-</button>
            <button onclick="sellProduct(${index})">💰</button>
            <button onclick="del(${index})">🗑</button>
          </td>
        </tr>
      `;
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const productName = document.getElementById("name").value.trim();
  const productQuantity = parseInt(document.getElementById("quantity").value, 10);
  const productMinStock = parseInt(document.getElementById("minStock").value, 10);
  const productPrice = parseFloat(document.getElementById("price").value);

  if (
    !productName ||
    isNaN(productQuantity) ||
    isNaN(productMinStock) ||
    isNaN(productPrice)
  ) {
    alert("Completá correctamente todos los campos");
    return;
  }

  products.push({
    name: productName,
    quantity: productQuantity,
    minStock: productMinStock,
    price: productPrice
  });

  addHistory(`Producto agregado: ${productName} (${productQuantity}) $${productPrice}`);
  save();
  renderStock(searchInput.value);
  updateTotals();
  form.reset();
});

function add(index) {
  products[index].quantity++;
  addHistory(`Se sumó stock a ${products[index].name}`);
  save();
  renderStock(searchInput.value);
}

function remove(index) {
  if (products[index].quantity > 0) {
    products[index].quantity--;
    addHistory(`Se restó stock a ${products[index].name}`);
    save();
    renderStock(searchInput.value);
  }
}

function del(index) {
  addHistory(`Producto eliminado: ${products[index].name}`);
  products.splice(index, 1);
  save();
  renderStock(searchInput.value);
}

function sellProduct(index) {
  const product = products[index];

  const amount = parseInt(
    prompt(`¿Cuántas unidades vendiste de "${product.name}"?`),
    10
  );

  if (isNaN(amount) || amount <= 0) {
    alert("Cantidad inválida");
    return;
  }

  if (amount > product.quantity) {
    alert("No hay stock suficiente");
    return;
  }

  const total = amount * product.price;

  product.quantity -= amount;

  sales.push({
    product: product.name,
    quantity: amount,
    price: product.price,
    total,
    date: new Date().toISOString()
  });

  addHistory(`Venta: ${product.name} (${amount}) $${total}`);
  save();
  renderStock(searchInput.value);
  updateTotals();
}

searchInput.addEventListener("input", e => {
  renderStock(e.target.value);
});

function updateTotals() {
  const total = sales.reduce((sum, s) => sum + s.total, 0);
  totalSoldEl.textContent = `$${total}`;
}

function dailyReport() {
  const today = new Date().toISOString().slice(0, 10);
  const total = sales
    .filter(s => s.date.startsWith(today))
    .reduce((sum, s) => sum + s.total, 0);

  alert(`Total vendido hoy: $${total}`);
}

function monthlyReport() {
  const month = new Date().toISOString().slice(0, 7);
  const total = sales
    .filter(s => s.date.startsWith(month))
    .reduce((sum, s) => sum + s.total, 0);

  alert(`Total vendido este mes: $${total}`);
}

function exportCSV() {
  let csv = "Producto,Cantidad,Minimo,Precio\n";
  products.forEach(p => {
    csv += `${p.name},${p.quantity},${p.minStock},${p.price}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "stock.csv";
  a.click();
}

renderStock();
renderHistory();
updateTotals();

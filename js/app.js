// Control de stock


const productos = JSON.parse(localStorage.getItem("productos")) || [];


let contadorId = productos.length > 0 
    ? productos[productos.length - 1].id + 1 
    : 1;


const form = document.getElementById("productForm");
const tabla = document.getElementById("productTable");


form.addEventListener("submit", function(e) {
    e.preventDefault();

    const nombre = document.getElementById("name").value;
    const cantidad = Number(document.getElementById("quantity").value);
    const stockMinimo = Number(document.getElementById("minStock").value);
    const precio = Number(document.getElementById("price").value);

    const productoNuevo = {
        id: contadorId,
        nombre,
        cantidad,
        stockMinimo,
        precio
    };

  
    productos.push(productoNuevo);

    
    localStorage.setItem("productos", JSON.stringify(productos));

    
    contadorId++;


    mostrarEnTabla(productoNuevo);

    form.reset();
});


function mostrarEnTabla(producto) {
    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${producto.nombre}</td>
        <td>${producto.cantidad}</td>
        <td>${producto.stockMinimo}</td>
        <td>$${producto.precio}</td>
        <td>--</td>
    `;

    tabla.appendChild(fila);
}


productos.forEach(producto => {
    mostrarEnTabla(producto);
});
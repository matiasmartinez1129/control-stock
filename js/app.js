//Control de stock

const productos = [];

let contadorId = 1;

let opcionMenu  ;

function cargarProducto(){
    let nombre = prompt("¿Nombre del producto?");
    let precio = Number(prompt("¿Precio del producto?"));
    let cantidad = Number(prompt("¿Stock actual del producto?"));
    let stockMinimo = Number(prompt("Elige la cantidad minima de stock"));


    let productoNuevo = {
        id: contadorId,
        nombre,
        precio,
        cantidad,
        stockMinimo
    }

    productos.push(productoNuevo)

    contadorId++

    alert("Producto cargado correctamente")
    console.log(productos);
    
}


function mostrarProductos(){
    if(productos.length === 0){
        console.log("No hay ningun producto cargado");
        
    }else{
        for(let i = 0; i < productos.length; i++){
            let producto = productos[i]
            console.log(producto);

            if(producto.cantidad <= producto.stockMinimo){
                console.log("⚠️ Stock bajo");
                
            }
            
        }

    }
}

while (true) {
    opcionMenu = Number(prompt("\n 1)Cargar producto \n 2)Mostrar Productos \n 3)Salir"));

    if(opcionMenu === 1){
        cargarProducto();
    }else if (opcionMenu === 2){
        mostrarProductos();
    }else if (opcionMenu === 3){
        alert("Saliste con exito")

        break;
    }else{
        alert("opcion invalida")
    }
    
    
}
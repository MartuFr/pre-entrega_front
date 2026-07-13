
    //VARIABLES GLOBALES
    let carrito = JSON.parse(localStorage.getItem('carritoStore')) || [];
    const contenedorProductos = document.getElementById('contenedor-productos');
    const itemsCarrito = document.getElementById('items-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    const contadorCarrito = document.getElementById('contador-carrito');
    const toast = document.getElementById('toast');

    //API Y RENDERIZADO DINÁMICO (MakeUp API)
    async function cargarProductos() {
        try {
            // Traemos productos de maquillaje Maybelline
            const respuesta = await fetch("https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline");
            const productos = await respuesta.json();
            
            contenedorProductos.innerHTML = ''; 
            
            
            const productosLimitados = productos.slice(0, 10);
            
            productosLimitados.forEach(prod => {
                const div = document.createElement('div');
                div.className = 'tarjeta-producto';
                
                
                const precio = prod.price && parseFloat(prod.price) > 0 ? parseFloat(prod.price) : 15.00;

                div.innerHTML = `
                    <img class="tarjeta-img" src="${prod.image_link}" alt="${prod.name}" onerror="this.src='img/logo.jpg'">
                    <div class="tarjeta-cuerpo">
                        <h3 class="tarjeta-titulo" style="font-size: 1.1rem;">${prod.name.substring(0, 20)}...</h3>
                        <p class="tarjeta-texto" style="font-weight: bold; font-size: 1.2rem;">$${precio.toFixed(2)}</p>
                        <button class="tarjeta-btn btn-comprar" style="border:none; cursor:pointer;" 
                            data-id="${prod.id}" data-nombre="${prod.name}" data-precio="${precio}">
                            Comprar ahora
                        </button>
                    </div>
                `;
                contenedorProductos.appendChild(div);
            });

            document.querySelectorAll('.btn-comprar').forEach(boton => {
                boton.addEventListener('click', (e) => agregarAlCarrito(e.target));
            });
        } catch (error) {
            console.error("Error al cargar la API:", error);
            contenedorProductos.innerHTML = '<p style="text-align:center; width:100%;">Hubo un error cargando el maquillaje.</p>';
        }
    }

    // CARRITO
    function agregarAlCarrito(boton) {
        const id = boton.getAttribute('data-id');
        const nombre = boton.getAttribute('data-nombre');
        const precio = parseFloat(boton.getAttribute('data-precio'));

        const existe = carrito.find(item => item.id === id);
        if (existe) {
            existe.cantidad++;
        } else {
            carrito.push({ id, nombre, precio, cantidad: 1 });
        }

        actualizarCarrito();
        mostrarFeedback();
    }

    function eliminarDelCarrito(id) {
        carrito = carrito.filter(item => item.id !== id);
        actualizarCarrito();
    }

    function actualizarCarrito() {
        localStorage.setItem('carritoStore', JSON.stringify(carrito));
        
        itemsCarrito.innerHTML = '';
        let total = 0;
        let cantidadElementos = 0;

        carrito.forEach(item => {
            total += item.precio * item.cantidad;
            cantidadElementos += item.cantidad;

            const div = document.createElement('div');
            div.className = 'item-carrito';
            div.innerHTML = `
                <div style="width: 80%;">
                    <p style="margin:0; font-weight:bold;">${item.nombre.substring(0, 15)}...</p>
                    <p style="margin:0; color: #666;">$${item.precio} x ${item.cantidad}</p>
                </div>
                <button class="btn-eliminar" onclick="eliminarDelCarrito('${item.id}')">X</button>
            `;
            itemsCarrito.appendChild(div);
        });

        totalCarrito.textContent = total.toFixed(2);
        contadorCarrito.textContent = cantidadElementos;
    }

    
    function mostrarFeedback() {
        toast.classList.add('mostrar');
        setTimeout(() => toast.classList.remove('mostrar'), 2500);
    }

    
    document.getElementById('abrir-carrito').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('carrito-lateral').classList.add('abierto');
    });

    document.getElementById('cerrar-carrito').addEventListener('click', () => {
        document.getElementById('carrito-lateral').classList.remove('abierto');
    });

    
    actualizarCarrito(); 
if (contenedorProductos) {
    cargarProductos();
}   

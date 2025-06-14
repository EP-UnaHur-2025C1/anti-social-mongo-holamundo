const mongoose = require('mongoose');
const Fabricante = require('../Schemas/fabricanteSchema');
const Producto = require('../Schemas/productosSchema');

const initData = async() => {
    try{
        
        await Fabricante.deleteMany({});
        console.log('Colección de fabricantes limpiada');

        await Producto.deleteMany({});
        console.log('Colección de productos limpiada');
        
       
        const fabricantes = await Fabricante.insertMany([
            {
            nombre: "TechCorp",
            direccion: "1234 Elm St, Ciudad",
            numeroContacto: "+123456789",
            pathImgPerfil: "images/fabricantes/techcorp.jpg",
            },
            {
            nombre: "Innovatech",
            direccion: "4567 Oak Ave, Ciudad",
            numeroContacto: "+987654321",
            pathImgPerfil: "images/fabricantes/innovatech.jpg",
            },
            {
            nombre: "Lenovo",
            direccion: "9876 Castelar, Ciudad",
            numeroContacto: "+111222333",
            pathImgPerfil: "images/fabricantes/lenovo.jpg",
            },
        ]);
        console.log('Fabricantes creados correctamente');
    
        const productos = await Producto.insertMany([
            {
            nombre: "Laptop X200",
            descripcion: "Una laptop de alto rendimiento",
            precio: 1200.99,
            pathImg: "images/productos/laptop-x200.jpg",
            fabricanteId: fabricantes[0]._id, // Relación directa
            componentes: [
                {
                nombre: "Procesador Intel i7",
                descripcion: "Procesador de octava generación",
                },
                {
                nombre: "SSD 1TB",
                descripcion: "Disco sólido de 1TB de capacidad",
                },
            ],
            },
            {
            nombre: "Smartphone s5",
            descripcion: "Teléfono inteligente con pantalla OLED",
            precio: 799.99,
            pathImg: "images/productos/smartphone-s5.jpg",
            fabricanteId: fabricantes[1]._id, // Relación directa
            componentes: [
                {
                nombre: "Pantalla OLED 6.5 pulgadas",
                descripcion: "Pantalla de alta definición",
                },
                {
                nombre: "Batería 4000mAh",
                descripcion: "Batería de larga duración",
                },
            ],
            },
            {
            nombre: "Laptop Thinkpad",
            descripcion: "Laptop de hogar",
            precio: 999.99,
            pathImg: "images/productos/laptopthinkpad.jpg",
            fabricanteId: fabricantes[2]._id, // Relación directa
            componentes: [
                {
                nombre: "Procesador Intel i3",
                descripcion: "Procesador de 4 núcleos",
                },
                {
                nombre: "SSD 512GB",
                descripcion: "Disco sólido de 512GB de capacidad",
                },
            ],
            },
        ]);
        console.log('Productos creados correctamente');
    
        for (const producto of productos) {
            await Fabricante.findByIdAndUpdate(producto.fabricanteId, {
            $push: { productoId: producto._id },
            });
        }
        console.log('Relaciones establecidas correctamente');
        
            
    } catch(err){
        console.error('Error al inicializar los datos', err.message);
    }
}

module.exports = initData; 
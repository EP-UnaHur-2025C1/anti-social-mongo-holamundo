const mongoose = require('mongoose');
const Usuario = require('../Schemas/userSchema');
const Post = require('../Schemas/postSchema');
const Tag = require('../Schemas/tagSchema');

const initData = async() => {
    try{
        
        await Usuario.deleteMany({});
        console.log('Colección de usuarios limpiada');

        await Post.deleteMany({});
        console.log('Colección de posts limpiada');
        await Tag.deleteMany({});
        console.log('Colección deTags limpiada');
       
        
    
        const usuarios = await Usuario.insertMany([
            {
            nickname: "juanmabritez",
            email: "juanmanuelbritez@gmail.com",
            password: "+123456789",
            pathImgPerfil: "images/usuarios/juanma.jpg",
            },
            {
            nickname: "vanina",
            email: "vanina@gmail.com",
            password: "123321",
            pathImgPerfil: "images/usuarios/vanina.jpg",
            },
            {
            nickname: "ezequiel",
            email: "ezequiel@gmail.com",
            password: "ezequiel123",
            pathImgPerfil: "images/usuarios/ezequiel.jpg",
            },
        ]);
        console.log('Usuarios creados correctamente');
    
        const posts = await Post.insertMany([
            {
            descripcion: "Un lindo viaje con amigos",
            fecha: Date.now(),
            pathImg: "images/post/viaje.jpg",
            userId: usuarios[0]._id, // Relación directa
            comentarios: [
                {
                descripcion: "buenaaa",
                fecha: Date.now(),
                userId: usuarios[1]._id
                },
                {
                descripcion: "crack",
                fecha: Date.now(),
                userId: usuarios[1]._id
                },
            ],
            },
            {
            descripcion: "Un lindo viaje con amigos",
            fecha: Date.now(),
            pathImg: "images/post/viaje.jpg",
            userId: usuarios[1]._id, // Relación directa
            comentarios: [
                {
                descripcion: "locura",
                fecha: Date.now(),
                userId: usuarios[0]._id, // Relación directa
                },
                {
                descripcion: "insolito",
                fecha: Date.now(),
                userId: usuarios[2]._id
                },
            ],
            },
            {
            descripcion: "comidita rica",
            fecha: Date.now(),
            pathImg: "images/post/comida.jpg",
            userId: usuarios[2]._id, // Relación directa
            comentarios: [
                {
                descripcion: "cociname eso",
                fecha: Date.now(),
                userId: usuarios[1]._id
                },
                {
                descripcion: "rompiste",
                fecha: Date.now(),
                userId: usuarios[0]._id // Relación directa
                },
            ],
            },
        ]);
        console.log('Posts creados correctamente');

        
        for (const post of posts) {
            await Usuario.findByIdAndUpdate(post.userId, {
            $push: { postId: post._id },
            });
        }
        console.log('Relaciones establecidas correctamente');
        const tags = await Tag.insertMany([
            {
            nombre: "#viaje",
            postId: [posts[0]._id, posts[1]._id], // Rel
            },
            {
            nombre: "#comida",
            postId: [posts[2]._id], // Relación con el post 3
            },
            {
            nombre: "#amigos",
            postId: [posts[0]._id, posts[1]._id], // Relación con los posts 1 y 2
            },
        ]);
        console.log('Tags creados correctamente');
            
    } catch(err){
        console.error('Error al inicializar los datos', err.message);
    }
}

module.exports = initData; 

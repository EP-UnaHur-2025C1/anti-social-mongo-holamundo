const Usuario = require('../Schemas/userSchema')
const Post = require('../Schemas/postSchema');
const redisClient = require('../config/redisClient');
const controller = {}
const mongoose = require('../db/mongo.db').mongoose;

const getUsers = async (req, res) => {
  const cachedUsers = await redisClient.get("users");
  if (cachedUsers) {
    return res.status(200).json(JSON.parse(cachedUsers));
  }else{
  const data = await Usuario.find({})
    .populate('postId', 'descripcion fecha pathImg userId comentarios')
    .populate('postId.userId', 'nickname email pathImgPerfil')
    .populate('seguidores', 'nickname email pathImgPerfil')
    .populate('seguidos', 'nickname email pathImgPerfil');
  if (!data || data.length === 0) {
    return res.status(404).json({ message: "No se encontraron usuarios" });
  } 
  await redisClient.set("users", JSON.stringify(data), {
    EX: 3600, // Expira en 1 hora
    NX: true, // Solo establece si no existe  
  });
  res.status(200).json(data);
  
  }
};
controller.getUsers = getUsers

const getUserById = async (req, res) => {
  const cachedUser = await redisClient.get(`user:${req.params.id}`);
  if (cachedUser) {
    return res.status(200).json(JSON.parse(cachedUser));
  }else{
  const data = await Usuario.findById(req.params.id).populate('postId', 'descripcion fecha pathImg userId comentarios')
    .populate('postId.userId', 'nickname email pathImgPerfil')
    .populate('seguidores', 'nickname email pathImgPerfil')
    .populate('seguidos', 'nickname email pathImgPerfil');
  await redisClient.set(`user:${req.params.id}`, JSON.stringify(data), {
    EX: 3600, // Expira en 1 hora
    NX: true, // Solo establece si no existe
  });
  res.status(200).json(data);
}
}
controller.getUserById = getUserById
const createUser = async (req, res) => {
  try {
    const newUser = await Usuario.create(req.body);
    // Limpiar la caché de usuarios en Redis
    await redisClient.del("users");
    await redisClient.del(`user:${newUser._id}`); // Limpiar la caché del usuario recién creado
    await redisClient.del(`posts:user:${newUser._id}`); // Limpiar la caché de posts del usuario recién creado
    await redisClient.del(`comments:user:${newUser._id}`); // Limpiar la caché de comentarios del usuario recién creado
    await redisClient.del(`followers:user:${newUser._id}`); // Limpiar la caché de seguidores del usuario recién creado
    await redisClient.del(`following:user:${newUser._id}`); // Limpiar la caché de seguidos del usuario recién creado
    res.status(201).json(newUser);
  } catch (e) {
    res.status(400).json({ error: e });
  }
};
controller.createUser = createUser
const updateUser = async (req, res) => {
  const { id } = req.params; 
  try { 
    const updatedUser = await Usuario.findByIdAndUpdate(
        id, 
        req.body, 
        { new: true } 
    );
    if (!updatedUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }
    await redisClient.del("users"); // Limpiar la caché de usuarios en Redis
    await redisClient.del(`user:${id}`); // Limpiar la caché del usuario actualizado
    await redisClient.del(`posts:user:${id}`); // Limpiar la caché de posts del usuario
    await redisClient.del(`comments:user:${id}`); // Limpiar la caché de comentarios del usuario
    await redisClient.del(`followers:user:${id}`); // Limpiar la caché de seguidores del usuario
    await redisClient.del(`following:user:${id}`); // Limpiar la caché de seguidos del usuario
    res.status(200).json(updatedUser);
    } catch (error) {
    res.status(400).json({ error: "Error al actualizar el usuario", details: error.message });
  }
};
controller.updateUser = updateUser
const deleteById = async (req, res) => {
  const data = await Usuario.findById(req.params.id);
  const removed = await Usuario.findByIdAndDelete(req.params.id);
  res.status(200).json(removed);
  await redisClient.del("users"); // Limpiar la caché de usuarios en Redis
  await redisClient.del(`user:${req.params.id}`); // Limpiar la caché del usuario eliminado
  await redisClient.del(`posts:user:${req.params.id}`); // Limpiar la caché de posts del usuario eliminado
  await redisClient.del(`comments:user:${req.params.id}`); // Limpiar la caché de comentarios del usuario eliminado
  await redisClient.del(`followers:user:${req.params.id}`); // Limpiar la caché de seguidores del usuario eliminado
  await redisClient.del(`following:user:${req.params.id}`); // Limpiar la caché de seguidos del usuario eliminado
  if (!data) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
};

controller.deleteById = deleteById
const getPostsByUser = async (req, res) => {
  const { id } = req.params; // ID del usuario
  const cachedPosts = await redisClient.get(`posts:user:${id}`);
  if (cachedPosts) {
    return res.status(200).json(JSON.parse(cachedPosts));
  }else{
  try {
    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findById(id);
    if (!usuarioExistente) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Buscar los posts del usuario
    const posts = await Post.find({ userId: id }).populate('userId', 'nickname email');
    if (posts.length === 0) {
      return res.status(404).json({ message: "No se encontraron posts para este usuario" });
    }
    for (let post of posts) {
      post.comentarios = post.comentarios.filter(comentario => comentario.visible);
    }
    for (let post of posts) {
      post.comentarios = post.comentarios.map(comentario => ({
        _id: comentario._id,
        descripcion: comentario.descripcion,
        fecha: comentario.fecha,
        userId: comentario.userId
      }));
    }
    await redisClient.set(`posts:user:${id}`, JSON.stringify(posts), {
      EX: 3600, // Expira en 1 hora
      NX: true, // Solo establece si no existe
    });
    res.status(200).json(posts);
    
} catch (error) {
    res.status(500).json({ message: "Error al obtener los posts del usuario", error: error.message });
}
}
};
controller.getPostsByUser = getPostsByUser
const addPost = async (req, res) => {  
    const { id } = req.params; // ID del usuario
    const { descripcion, fecha, pathImg,comentarios} = req.body; // Datos del nuevo post
    try {
        // Verificar si el usuario existe
        const usuarioExistente = await Usuario.findById(id);
        if (!usuarioExistente) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Crear el nuevo post
        const nuevoPost = new Post({
            descripcion,
            fecha,
            pathImg,
            userId: id, // Asociar el post al usuario
            comentarios: comentarios || [] // Asociar comentarios si existen
        });

        // Guardar el post en la base de datos
        const postGuardado = await nuevoPost.save();

        // Agregar el ID del post al array de posts del usuario
        usuarioExistente.postId.push(postGuardado._id);
        await usuarioExistente.save();
        await redisClient.del(`posts:user:${id}`); // Limpiar la caché de posts del usuario
        await redisClient.del(`user:${id}`); // Limpiar la caché del usuario
        res.status(201).json(postGuardado);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el post", error: error.message });
    }    
}
controller.addPost = addPost
const getCommentsByUser = async (req, res) => {
  const { id } = req.params; // ID del usuario
  const cachedComments = await redisClient.get(`comments:user:${id}`);
  if (cachedComments) {
    return res.status(200).json(JSON.parse(cachedComments));
  }else{
  try {
    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findById(id);
    if (!usuarioExistente) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Buscar en todos los posts del sistema
    // y filtrar los comentarios del usuario
    const posts = await Post.find({ "comentarios.userId": id })
      .populate('comentarios.userId', 'nickname email') // Poblamos los datos del usuario en los comentarios
      .select('comentarios'); // Solo seleccionamos los comentarios    
    if (posts.length === 0) {
      return res.status(404).json({ message: "No se encontraron posts para este usuario" });
    }

    // Filtrar los comentarios visibles
    const comentariosVisibles = posts.flatMap(post => 
      post.comentarios.filter(comentario => comentario.visible)
    );
    await redisClient.set(`comments:user:${id}`, JSON.stringify(comentariosVisibles), {
      EX: 3600, // Expira en 1 hora
      NX: true, // Solo establece si no existe
    });
    res.status(200).json(comentariosVisibles);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los comentarios del usuario", error: error.message });
  }
}
};
controller.getCommentsByUser = getCommentsByUser
const addCommentsByUser = async (req, res) => {
  const { id } = req.params; // ID del usuario
  const { postId, descripcion } = req.body; // Datos del nuevo comentario
  try {
    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findById(id);
    if (!usuarioExistente) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }  
    // Verificar si el post existe
    const postExistente = await Post.findById(postId);
    if (!postExistente) {
      return res.status(404).json({ message: "Post no encontrado" });
    }
    // Crear el nuevo comentario
    const nuevoComentario = {
      descripcion,
      fecha: Date.now(),  // Fecha actual
      visible: true, // Por defecto, los comentarios son visibles
      userId: id // Asociar el comentario al usuario
    };
    // Agregar el comentario al post
    postExistente.comentarios.push(nuevoComentario);
    await postExistente.save();
    // Agregar el ID del comentario al array de comentarios del usuario
    usuarioExistente.comentarios.push(nuevoComentario);
    await usuarioExistente.save();
    await redisClient.del(`comments:user:${id}`); // Limpiar la caché de comentarios del usuario
    await redisClient.del(`posts:user:${id}`); // Limpiar la caché de posts del usuario
    await redisClient.del(`user:${id}`); // Limpiar la caché del usuario
    await redisClient.del(`comments:post:${postId}`); // Limpiar la caché de comentarios del post
    await redisClient.del(`post:${postId}`); // Limpiar la caché del post
    res.status(201).json(nuevoComentario);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar el comentario", error:error.message });
  }
} 
controller.addCommentsByUser = addCommentsByUser
const getFollowers = async (req, res) => {
  const { id } = req.params; // ID del usuario
  const cachedFollowers = await redisClient.get(`followers:user:${id}`);
  if (cachedFollowers) {
    return res.status(200).json(JSON.parse(cachedFollowers));
  }else{
  try {
    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findById(id).populate('seguidores', 'nickname email pathImgPerfil');
    if (!usuarioExistente) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    await redisClient.set(`followers:user:${id}`, JSON.stringify(usuarioExistente.seguidores), {
      EX: 3600, // Expira en 1 hora
      NX: true, // Solo establece si no existe
    });

    res.status(200).json(usuarioExistente.seguidores);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los seguidores del usuario", error: error.message });
  }
}
}
controller.getFollowers = getFollowers
const getFollowing = async (req, res) => {
  const { id } = req.params; // ID del usuario
  const cachedFollowing = await redisClient.get(`following:user:${id}`);
  if (cachedFollowing) {
    return res.status(200).json(JSON.parse(cachedFollowing));
  }else{
  try {
    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findById(id).populate('seguidos', 'nickname email pathImgPerfil');
    if (!usuarioExistente) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    await redisClient.set(`following:user:${id}`, JSON.stringify(usuarioExistente.seguidos), {
      EX: 3600, // Expira en 1 hora
      NX: true, // Solo establece si no existe
    });
    res.status(200).json(usuarioExistente.seguidos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios que sigue", error: error.message });
  }
} 
}
controller.getFollowing = getFollowing
const followUser = async (req, res) => {
  const { id } = req.params; // ID del usuario que sigue
  const { followId } = req.body; // ID del usuario a seguir
  try {
    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findById(id);
    if (!usuarioExistente) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Verificar si el usuario a seguir existe
    const usuarioAFollow = await Usuario.findById(followId);
    if (!usuarioAFollow) {
      return res.status(404).json({ message: "Usuario a seguir no encontrado" });
    }
    // Verificar si ya sigue al usuario
    if (usuarioExistente.seguidos.includes(followId)) {
      return res.status(400).json({ message: "Ya sigues a este usuario" });
    }
    // Agregar al usuario a la lista de seguidos
    usuarioExistente.seguidos.push(followId);
    await usuarioExistente.save();
    // Agregar al usuario a la lista de seguidores del usuario seguido
    usuarioAFollow.seguidores.push(id);
    await usuarioAFollow.save();
    await redisClient.del(`followers:user:${followId}`); // Limpiar la caché de seguidores del usuario seguido
    await redisClient.del(`following:user:${id}`); // Limpiar la caché de seguidos del usuario que sigue
    await redisClient.del(`user:${id}`); // Limpiar la caché del usuario  
    await redisClient.del(`user:${followId}`); // Limpiar la caché del usuario seguido
    await redisClient.del(`posts:user:${id}`); // Limpiar la caché de posts del usuario que sigue
    await redisClient.del(`posts:user:${followId}`); // Limpiar la caché de posts del usuario seguido
    await redisClient.del(`comments:user:${id}`); // Limpiar la caché de comentarios del usuario que sigue
    await redisClient.del(`comments:user:${followId}`); // Limpiar la caché de comentarios del usuario seguido
    res.status(200).json({ message: "Usuario seguido correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al seguir al usuario", error: error.message });
  }
}
controller.followUser = followUser
const unfollowUser = async (req, res) => {
  const { id } = req.params; // ID del usuario que deja de seguir
  const { followId } = req.body; // ID del usuario a dejar de seguir
  try {
    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findById(id);
    if (!usuarioExistente) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Verificar si el usuario a dejar de seguir existe
    const usuarioAUnfollow = await Usuario.findById(followId);
    if (!usuarioAUnfollow) {
      return res.status(404).json({ message: "Usuario a dejar de seguir no encontrado" });
    }
    // Verificar si ya no sigue al usuario
    if (!usuarioExistente.seguidos.includes(followId)) {
      return res.status(400).json({ message: "No sigues a este usuario" });
    }
    // Eliminar al usuario de la lista de seguidos
    usuarioExistente.seguidos.pull(followId);
    await usuarioExistente.save();
    // Eliminar al usuario de la lista de seguidores del usuario seguido
    usuarioAUnfollow.seguidores.pull(id);
    await usuarioAUnfollow.save();
    await redisClient.del(`followers:user:${followId}`); // Limpiar la caché de seguidores del usuario seguido
    await redisClient.del(`following:user:${id}`); // Limpiar la caché de seguidos del usuario que sigue
    await redisClient.del(`user:${id}`); // Limpiar la caché del usuario  
    await redisClient.del(`user:${followId}`); // Limpiar la caché del usuario seguido
    await redisClient.del(`posts:user:${id}`); // Limpiar la caché de posts del usuario que sigue
    await redisClient.del(`posts:user:${followId}`); // Limpiar la caché de posts del usuario seguido
    await redisClient.del(`comments:user:${id}`); // Limpiar la caché de comentarios del usuario que sigue
    await redisClient.del(`comments:user:${followId}`); // Limpiar la caché de comentarios del usuario seguido
    
    res.status(200).json({ message: "Usuario dejado de seguir correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al dejar de seguir al usuario", error: error.message });
  }
}
controller.unfollowUser = unfollowUser
module.exports = controller
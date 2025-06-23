
# 🧠 UnaHur Anti-Social Net - Backend

Backend desarrollado en Node.js + MongoDB para una red social educativa que permite publicaciones, comentarios, etiquetas, seguidores y más.

---

## 🚀 Tecnologías Usadas

- Node.js + Express
- MongoDB + Mongoose
- Redis (caching)
- Swagger (documentación)
- Docker + Docker Compose
- Joi (validaciones)
- Nodemon (desarrollo)

---

## 📁 Estructura del Proyecto

```
anti-social-mongo-holamundo/
├──   src/
├──     ├── controllers/
├──     ├── db/
├──     ├── init/
├──     ├── middlewares/
├──     ├── routes/
├──     ├── schemas/
├──     ├── swagger/
├──     ├── models/
├──     ├── app.js
├──     └── main.js
├── dockerignore
├── .env
├── .docker-compose.yml
├──dockerfile
├── package-lock.json
└──  package.json
```

---

## ⚙️ Instalación y Uso

### 🔧 Cloná el proyecto

```bash
git clone https://github.com/tu-usuario/anti-social-net.git
cd anti-social-net
```

### 📦 Instalá dependencias

```bash
npm install
```

---

## 🐳 Uso con Docker

### 🧱 Construir y levantar contenedores

```bash
npm run docker:build
npm run docker:up
```

### 🚀 Ejecutar en desarrollo

```bash
npm run dev
```

### 🛑 Apagar contenedores

```bash
npm run docker:down
```

---

## 📌 Scripts útiles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia con nodemon y Docker (modo desarrollo) |
| `npm run start` | Ejecuta el proyecto en producción |
| `npm run docker:up` / `docker:down` | Control de contenedores |

---

## 🧪 Funcionalidades

### 👤 Usuarios
- Obtener, crear, eliminar
- Seguir / dejar de seguir
- Ver seguidores / seguidos

### 📝 Post
- Crear post con descripción e imagen (por URL)
- Agregar y listar comentarios visibles
- Obtener, crear, eliminar

### 🏷️ Tag
- Crear y listar etiquetas
- Obtener, crear, eliminar

### 🖼️ Image
- Obtener, crear, eliminar
- Actualizar y eliminar (por URL)

---

## 📑 Swagger - Documentación de API

Disponible en:  
🌐 [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Documentado con `docker.compose.yaml`, incluyendo rutas, esquemas y ejemplos.

---

## 📁 Postman

Incluye colección de pruebas para:

- Crear usuarios y posts
- Seguir usuarios
- Comentar publicaciones
- Ver estructuras JSON esperadas

---

## 🧠 Observaciones

- Los comentarios más antiguos que X meses no se muestran (`.env → FECHAMAXCOMMENTS`).
- Las imágenes se almacenan como **URLs**, no como archivos físicos.
- Se implementó un sistema básico de **followers** entre usuarios.
- Redis está disponible para mejorar el cacheado de consultas (opcional).

---

## 👥 Autores

- Juanma Britez
- Vanina Cejas
- Ezequiel Escobar
- Franco Rueta

---


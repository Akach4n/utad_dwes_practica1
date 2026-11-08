**Nombre completo:** Izan Fernández Martín\
**Curso:** 2ºDAW\
**Asignatura:** Desarrollo en entorno servidor\
**Centro:** U-tad

# Red social – API REST

API REST de una mini red social de vídeos hecha con **Express 5** y **MongoDB (Mongoose)**. Las contraseñas de los usuarios se guardan hasheadas con **bcrypt** y nunca se devuelven en las respuestas.

## Puesta en marcha

Requiere Node 20.6 o superior.

```bash
pnpm install
cp .env.example .env   # rellenar MONGODB_URI y DB_NAME
pnpm dev               # desarrollo (se reinicia al guardar)
pnpm start             # ejecución normal
```

## Endpoints

Cada recurso tiene un CRUD completo:

| Método | Ruta | Acción |
|---|---|---|
| GET | `/<recurso>` | Listar todos |
| GET | `/<recurso>/:id` | Obtener uno |
| POST | `/<recurso>` | Crear |
| PUT | `/<recurso>/:id` | Actualizar |
| DELETE | `/<recurso>/:id` | Eliminar |

Recursos: `users`, `videos`, `comments`, `likes`, `subscriptions`, `views`.

Respuestas: `400` si el ID o los datos no son válidos, `404` si no existe, `500` ante errores del servidor.

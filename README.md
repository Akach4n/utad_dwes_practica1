# utad_dwes_practica1

API REST de una red social de vídeos (estilo YouTube) hecha con **Express 5** y **MongoDB (Mongoose)**.

## Datos del alumno

- **Nombre completo:** Izan Fernández Martín
- **Curso:** 2ºDAW
- **Asignatura:** Desarrollo en entorno servidor
- **Centro:** U-tad

## Cómo arrancarlo

Requisitos: Node 20.6 o superior (usa `--env-file`), pnpm y una base de datos MongoDB 

```bash
pnpm install
cp .env.example .env     # y rellena los valores
pnpm dev
```

Variables de entorno (`.env`):

| Variable      | Descripción                               |
| ------------- | ----------------------------------------- |
| `PORT`        | Puerto del servidor (por ejemplo, `3000`) |
| `MONGODB_URI` | Cadena de conexión a MongoDB              |

## Estructura

```
app.js                      Arranca la API: configura Express, conecta a la BD y escucha
config/
  db.js                     Conexión a MongoDB
features/                   Una carpeta por recurso: modelo, controlador y rutas
  users/
  videos/
  comments/                 + comment.helper.js (carga recursiva de respuestas)
  likes/
  subscriptions/
  views/
  feed/                     Solo controlador y rutas (no tiene modelo)
middlewares/
  requester.js              Identifica al usuario que hace la petición
  errorHandler.js           Convierte los errores en respuestas HTTP
utils/
  helpers.js                isMinor() y canWatch()
tests/                      Ficheros .http para probar todas las rutas (REST Client)
```

## Endpoints

Todos los recursos tienen CRUD completo:

| Método | Ruta             | Acción         |
| ------ | ---------------- | -------------- |
| GET    | `/<recurso>`     | Obtener todos  |
| GET    | `/<recurso>/:id` | Obtener por id |
| POST   | `/<recurso>`     | Crear          |
| PUT    | `/<recurso>/:id` | Modificar      |
| DELETE | `/<recurso>/:id` | Borrar         |

Recursos: `/users`, `/videos`, `/comments`, `/likes`, `/subscriptions`, `/views`.

Además:

| Método | Ruta              | Acción                                           |
| ------ | ----------------- | ------------------------------------------------ |
| GET    | `/feed?sub=true`  | Vídeos de los canales a los que sigue el usuario |
| GET    | `/feed?sub=false` | Vídeos de todos los usuarios                     |

Parámetro `load` (en `GET /videos`, `GET /videos/:id`, `GET /comments` y `GET /comments/:id`):

- `lazy` (por defecto): solo el elemento.
- `full`: el elemento con todos sus sub-elementos de forma recursiva (vídeo → comentarios → respuestas → respuestas...).

Los vídeos incluyen `viewsCount`, `likesCount` y `commentsCount`. Los comentarios incluyen `likesCount`.

## Decisiones de diseño

- **Identificación del usuario:** el enunciado no incluye autenticación, así que el usuario que hace la petición se identifica con la cabecera `x-user-id` (el `_id` del usuario). El middleware `requester` la valida y deja el usuario en `req.requester`. Se aplica a `/videos`, `/comments`, `/likes`, `/views` y `/feed`. `/users` y `/subscriptions` no la necesitan.
- **Menores de 18 años:** no ven vídeos que no sean `kidsFriendly` (se filtran en los listados y devuelven `403` por id), ni pueden comentarlos, darles like o generar visualizaciones (`403`).
- **Visualizaciones:** `GET /videos/:id` registra automáticamente una visualización. Solo existe una por usuario, vídeo y día: el campo `day` se guarda normalizado a las 00:00 UTC y hay un índice único sobre `{ user, video, day }`.
- **Comentarios:** una respuesta guarda su `parent` y también su `video`, así que los contadores y las búsquedas por vídeo cuentan comentarios y respuestas.
- **Likes:** un like apunta a un vídeo **o** a un comentario, nunca a los dos. Hay un índice único parcial por cada caso, para impedir likes repetidos.
- **Suscripciones:** índice único sobre `{ subscriber, channel }` y no se permite suscribirse a uno mismo.
- **Fechas:** `publishedAt` y `subscribedAt` las pone el servidor; el cliente no las envía.
- **Contraseñas:** se guardan hasheadas con bcrypt y no se devuelven en las consultas.
- **Errores:** todos los controladores usan `try/catch` y delegan en `errorHandler`:

| Situación                                                   | Código |
| ----------------------------------------------------------- | ------ |
| Datos inválidos, id mal formado, falta un campo obligatorio | `400`  |
| Usuario menor de edad ante un vídeo no apto                 | `403`  |
| Recurso inexistente                                         | `404`  |
| Valor repetido (índice único)                               | `409`  |
| Cualquier otro error                                        | `500`  |

## Pruebas

En `tests/` hay un fichero `.http` por recurso (`users`, `videos`, `comments`, `likes`, `subscriptions`, `views` y `feed`), para la extensión **REST Client** de VS Code. Cada uno empieza con peticiones de preparación que crean sus propios datos; hay que lanzarlas de arriba abajo antes de las pruebas.

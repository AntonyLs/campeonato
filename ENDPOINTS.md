# Endpoints - Campeonato API

Listado de endpoints disponibles, agrupados por modulo.

Base URL: `http://localhost:3000/api`

Convenciones:
- `Authorization: Bearer TOKEN` indica que la ruta requiere token de sesion.
- Los `:id`, `:userId`, `:teamId`, `:token` son parametros de ruta.

---

## App

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/` | Healthcheck / mensaje base. |

---

## Auth

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| POST | `/auth/admin/login` | - | Login de administrador con `correo` o `dni` + `password`. |
| GET | `/auth/admin/me` | Bearer admin | Devuelve el admin autenticado. |
| POST | `/auth/delegate/login` | - | Login del delegado con `email + dni`. Devuelve token de sesion. |
| GET | `/auth/delegate/me` | Bearer delegado | Devuelve el delegado autenticado. |

Body de `POST /auth/admin/login`:

```json
{ "correo": "admin@mail.com", "password": "123456" }
```

o:

```json
{ "dni": "12345678", "password": "123456" }
```

Body de `POST /auth/delegate/login`:

```json
{ "email": "delegado@mail.com", "dni": "12345678" }
```

---

## Inscriptions

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| POST | `/inscriptions` | - | Crea inscripcion inicial (delegado + equipo) y envia notificacion por correo. |
| GET | `/inscriptions` | - | Lista todas las inscripciones con delegado, equipo y jugadores. |
| GET | `/inscriptions/:id` | - | Devuelve inscripcion por id del delegado. |
| PATCH | `/inscriptions/:id` | - | Actualiza datos generales de una inscripcion. |

Body de `POST /inscriptions`:

```json
{
  "nombres": "Carlos",
  "apellido_paterno": "Ramos",
  "apellido_materno": "Flores",
  "dni": "12345678",
  "celular": "999888777",
  "email": "delegado@mail.com",
  "nombre_equipo": "Los Halcones",
  "categoriaId": 1,
  "colegioProfesionalId": 1
}
```

---

## Delegate

Todas las rutas requieren `Authorization: Bearer TOKEN_DEL_DELEGADO`.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/delegate/me` | Perfil del delegado autenticado. |
| PATCH | `/delegate/me` | Actualiza el perfil del delegado autenticado. |
| GET | `/delegate/team` | Equipo del delegado autenticado. |
| PATCH | `/delegate/team` | Actualiza el equipo del delegado autenticado. |
| GET | `/delegate/players` | Lista jugadores del equipo del delegado. |
| POST | `/delegate/players` | Crea un jugador en el equipo del delegado. |
| PATCH | `/delegate/players/:id` | Actualiza un jugador del equipo del delegado. |
| DELETE | `/delegate/players/:id` | Elimina un jugador del equipo del delegado. |

Body de `POST /delegate/players`:

```json
{
  "nombres": "Juan Carlos",
  "apellido_paterno": "Perez",
  "apellido_materno": "Ramos",
  "dni": "87654321",
  "nro_colegiatura": "CAL-12345",
  "edad": 35
}
```

---

## Players

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/players` | Lista todos los jugadores con delegado y equipo. |
| GET | `/players/:id` | Devuelve un jugador por id. |
| PATCH | `/players/:id` | Actualiza un jugador por id. |
| DELETE | `/players/:id` | Elimina un jugador por id. |
| GET | `/teams/:teamId/players` | Lista jugadores de un equipo. |
| POST | `/users/:userId/players` | Crea jugador usando el delegado como referencia. |
| POST | `/users/:userId/teams/:teamId/players` | Crea jugador validando que el equipo pertenezca al delegado. |

---

## Users (delegados)

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/users` | Lista todos los delegados. |
| GET | `/users/with-team` | Lista delegados con su equipo y jugadores. |
| GET | `/users/:id` | Devuelve un delegado por id. |
| GET | `/users/:id/with-team` | Devuelve un delegado con su equipo y jugadores. |
| PATCH | `/users/:id` | Actualiza un delegado por id. |

---

## Teams

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/teams` | Lista todos los equipos. |
| GET | `/teams/with-users` | Lista equipos con delegado y jugadores. |
| GET | `/teams/:id` | Devuelve un equipo por id. |
| GET | `/teams/:id/with-user` | Devuelve un equipo con delegado y jugadores. |
| PATCH | `/teams/:id` | Actualiza un equipo por id. |

---

## Categorias

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/categorias` | Lista categorias. |
| GET | `/categorias/:id` | Devuelve categoria por id. |
| POST | `/categorias` | Crea categoria. |
| PATCH | `/categorias/:id` | Actualiza categoria. |
| DELETE | `/categorias/:id` | Elimina categoria. |

---

## Colegios profesionales

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/colegios-profesionales` | Lista colegios profesionales. |
| GET | `/colegios-profesionales/:id` | Devuelve un colegio profesional por id. |
| POST | `/colegios-profesionales` | Crea colegio profesional. |
| PATCH | `/colegios-profesionales/:id` | Actualiza colegio profesional. |
| DELETE | `/colegios-profesionales/:id` | Elimina colegio profesional. |

---

## Admins

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/admins` | Lista administradores. |
| GET | `/admins/:id` | Devuelve administrador por id. |
| POST | `/admins` | Crea administrador. |
| PATCH | `/admins/:id` | Actualiza administrador. |
| DELETE | `/admins/:id` | Elimina administrador. |

Body de `POST /admins`:

```json
{
  "organizador": "Comite Central",
  "correo": "admin@mail.com",
  "nro_celular": "999888777",
  "dni": "12345678",
  "password": "123456"
}
```

# TicoAutos Frontend

Nota: Si, todos los commits del front end estan hechos a ultima hora ya que olvide ir haciendo los commits y ademas gran parte si estan hechos con IA, esto debido a mi incapacidad de diseño de front end (soy muy malo en diseño), pido disculpas pero prometo que manejo todos los temas al dedo. gracias por su tiempo y compresion usuario curioso (Hola profe).

Frontend desacoplado del proyecto final `TicoAutos` para ISW-711.

## Stack

- HTML
- JavaScript modular
- Tailwind CSS por CDN
- CSS local complementario
- API REST consumida con `fetch`

## Funcionalidad implementada

- Registro y login contra el backend
- Persistencia de token y usuario en `localStorage`
- Catalogo publico con filtros y paginacion
- Detalle publico de vehiculo
- Copiar enlace publico
- Crear pregunta desde el detalle
- Dashboard privado
- Gestion de vehiculos propios
- Crear y editar vehiculos
- Marcar vehiculo como vendido
- Eliminar vehiculo
- Bandeja de preguntas hechas
- Bandeja de preguntas recibidas
- Historial por vehiculo
- Validaciones en frontend

## Estructura

```text
public/
  index.html
  register.html
  login.html
  vehicle-detail.html
  dashboard.html
  my-vehicles.html
  vehicle-form.html
  my-questions.html
  received-questions.html
assets/
  css/
    main.css
    auth.css
    dashboard.css
  js/
    api/
    auth/
    components/
    pages/
    utils/
```

## Requisitos

- Backend corriendo en `http://localhost:3001`
- Un servidor estatico para `public/`

## Como correrlo

La opcion mas simple es abrir `ticoautos-frontend` con Live Server.

Tambien puedes usar cualquier servidor estatico y abrir:

- `public/index.html`

## API base

Por defecto el frontend apunta a:

```text
http://localhost:3001/api
```

Ese valor se toma desde `assets/js/utils/storage.js`.

## Flujo de navegacion

- `index.html`: catalogo publico
- `register.html`: registro
- `login.html`: login
- `vehicle-detail.html?id=<vehicleId>`: detalle publico
- `dashboard.html`: panel principal privado
- `my-vehicles.html`: publicaciones del usuario
- `vehicle-form.html`: crear o editar
- `my-questions.html`: preguntas hechas
- `received-questions.html`: preguntas recibidas
- `received-questions.html?vehicleId=<vehicleId>`: historial por vehiculo

## Consideraciones

- Las imagenes se manejan como URLs en texto
- El share link publico usa la vista `vehicle-detail.html?id=<vehicleId>`
- Las rutas privadas dependen del token JWT guardado localmente
- El frontend no envia `owner` ni `answeredBy`

## Prueba rapida

1. Levanta el backend.
2. Abre `public/register.html` y crea un usuario.
3. Inicia sesion.
4. Crea un vehiculo en `vehicle-form.html`.
5. Revisa el catalogo en `index.html`.
6. Abre el detalle y envia una pregunta con otro usuario.
7. Responde desde `received-questions.html`.

# OWASP Vulnerabilities - Todo App

Aplicación Todo List con login de usuarios construida con React + Express + PostgreSQL que contiene **3 vulnerabilidades OWASP** con fines educativos.

## Vulnerabilidades incluidas

| # | Vulnerabilidad | Ubicación | Explicación |
|---|---|---|---|
| 1 | **SQL Injection** | `backend/routes/auth.js:21` y `backend/routes/todos.js` | Las queries SQL concatenan directamente el input del usuario sin usar parámetros. |
| 2 | **IDOR (Broken Access Control)** | `backend/routes/todos.js:8` | El `user_id` se toma del query param o del body en vez del token JWT. Un usuario puede ver/crear/eliminar tareas de otros. |
| 3 | **Security Misconfiguration** | `backend/server.js`, `backend/routes/auth.js` | CORS `*`, passwords en texto plano, stack traces expuestos, logs de queries SQL. |

## Requisitos

- Node.js 18+
- PostgreSQL 14+
- npm

## Configuración de PostgreSQL

### 1. Configurar autenticación por contraseña (recomendado)

Por defecto PostgreSQL usa autenticación `peer`. Para cambiarlo:

```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

Busca la línea:
```
local   all             postgres                                peer
```

Cámbiala a:
```
local   all             postgres                                md5
```

Luego reinicia PostgreSQL:
```bash
sudo systemctl restart postgresql
```

Asigna una contraseña al usuario `postgres`:
```bash
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
```

### 2. Crear la base de datos e inicializar tablas

```bash
sudo -u postgres psql -f backend/db/init.sql
```

### 3. Verificar conexión en `backend/db.js`

El archivo `backend/db.js` ya viene configurado con:
```js
const pool = new pg.Pool({
    host: 'localhost',
    port: 5432,
    database: 'todo_app',
    user: 'postgres',
    password: 'postgres'
});
```

Si tu PostgreSQL usa otro usuario/contraseña, edita ese archivo.

## Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/MiguelP04/owasp-vulnerabilities.git
cd owasp-vulnerabilities

# 2. Instalar dependencias del backend
cd backend
npm install

# 3. Instalar dependencias del frontend
cd ../frontend
npm install

# 4. Iniciar el backend (puerto 3000)
cd ../backend
npm run dev

# 5. En otra terminal, iniciar el frontend (puerto 5173)
cd frontend
npm run dev
```

Abrir `http://localhost:5173` en el navegador.

## Usuarios de prueba

| Email | Password |
|---|---|
| admin@test.com | admin123 |
| user1@test.com | user123 |

## Cómo explotar las vulnerabilidades

### SQL Injection

En la pantalla de login, introduce:
- **Email:** `' OR 1=1 --`
- **Password:** cualquier cosa

Esto inicia sesión como el primer usuario de la base de datos sin conocer su contraseña.

### IDOR (Broken Access Control)

Una vez en el Dashboard, hay un recuadro amarillo con un campo "User ID para filtrar". Introduce un ID de otro usuario (ej: `2`) y pulsa "Ver tareas de este usuario". También puedes modificar el `user_id` en el body al crear una tarea.

### Security Misconfiguration

- Los errores SQL se muestran completos en pantalla
- Los passwords están almacenados en texto plano en la base de datos
- El backend expone stack traces en las respuestas de error
- CORS permite peticiones desde cualquier origen
- Las queries SQL se loguean en la consola del backend

## Estructura del proyecto

```
├── backend/
│   ├── server.js              # Express, CORS, rutas
│   ├── db.js                  # Conexión a PostgreSQL
│   ├── db/init.sql            # Schema e inserts iniciales
│   ├── middleware/auth.js     # JWT middleware
│   └── routes/
│       ├── auth.js            # Login/Register (SQLi aquí)
│       └── todos.js           # CRUD de tareas (SQLi + IDOR aquí)
├── frontend/
│   ├── src/
│   │   ├── api.js             # Llamadas al backend
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       └── Dashboard.jsx  # Todo list con selector IDOR
│   └── ...
└── README.md
```

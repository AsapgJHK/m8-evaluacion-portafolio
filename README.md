## Servicio Web de Gestión de Perfiles (REST API)

### 🌟 Visión General del Proyecto

Este proyecto implementa una API RESTful robusta para la gestión de perfiles de usuario, enfocada en la seguridad y las buenas prácticas de la arquitectura REST. Utiliza Node.js y Express como framework principal, con **JWT** para la autenticación, **`bcryptjs`** para el cifrado de contraseñas y **`express-fileupload`** para manejar la subida de imágenes de perfil.

### 🔑 Características de Seguridad Implementadas

  * **Autenticación JWT:** Uso de tokens de acceso de corta duración (`Access Token`) para proteger todas las rutas sensibles.
  * **Refresh Tokens:** Mecanismo para obtener nuevos `Access Tokens` sin requerir credenciales de usuario repetidas.
  * **Cifrado de Contraseñas:** Uso de `bcryptjs` para hashear las contraseñas antes de su almacenamiento (incluso en la simulación de DB en memoria).
  * **Autorización granular:** El middleware verifica que el usuario autenticado solo pueda interactuar con *su propio perfil* (protección de auto-propiedad).
  * **Validación de Archivos:** Controles estrictos sobre el tipo (`JPG`, `PNG`, `GIF`) y el tamaño máximo (5MB) de las imágenes subidas.

### 🛠️ Configuración y Ejecución

Sigue estos pasos para poner en marcha la API en tu entorno local.

#### 1\. Prerrequisitos

  * Node.js (versión 18+)
  * npm

#### 2\. Instalación de Dependencias

Navega al directorio raíz del proyecto e instala las librerías necesarias:

```bash
npm install express express-fileupload jsonwebtoken dotenv bcryptjs
```

#### 3\. Configuración de Variables de Entorno

Crea un archivo llamado **`.env`** en la raíz del proyecto y establece las siguientes variables:

```env
PORT=3000
# Clave secreta fuerte para firmar y verificar los JWT.
JWT_SECRET=tu_secreto_muy_seguro_y_largo_aqui_para_produccion
# Ruta donde se guardarán las imágenes de perfil.
UPLOAD_PATH=./uploads 
```

#### 4\. Ejecución del Servidor

Inicia la aplicación:

```bash
node server.js
```

El servidor estará operativo en `http://localhost:3000`.

### 🗺️ Endpoints de la API

Todas las rutas de la API están prefijadas con `/api`.

| Recurso | Método | Ruta | Descripción | Requiere Auth |
| :--- | :--- | :--- | :--- | :--- |
| **Autenticación** | `POST` | `/api/auth/login` | Inicia sesión, devuelve `accessToken` y `refreshToken`. | No |
| **Autenticación** | `POST` | `/api/auth/refresh` | Usa el `refreshToken` para obtener un nuevo `accessToken`. | No |
| **Perfiles** | `POST` | `/api/usuarios` | Crea un nuevo perfil (Registro). | No |
| **Perfiles** | `GET` | `/api/usuarios/:id` | Obtiene el perfil por ID. | **Sí** |
| **Perfiles** | `PUT` | `/api/usuarios/:id` | Actualiza el perfil. | **Sí** |
| **Perfiles** | `DELETE` | `/api/usuarios/:id` | Elimina el perfil. | **Sí** |
| **Imágenes** | `POST` | `/api/usuarios/:id/imagen`| Sube/actualiza la imagen de perfil. | **Sí** |

### 🧪 Flujo de Prueba Detallado (Usando Postman o Insomnia)

#### Paso 1: Crear un Perfil (Registro)

1.  **Ruta:** `POST http://localhost:3000/api/usuarios`
2.  **Body (JSON):**
    ```json
    {
        "username": "usuario_prueba",
        "password": "miPasswordSeguro123"
    }
    ```
3.  **Resultado esperado:** `201 Created` y el objeto del perfil, incluyendo el `id` del nuevo usuario. **Guarda este `id`**.

#### Paso 2: Iniciar Sesión y Obtener Tokens

1.  **Ruta:** `POST http://localhost:3000/api/auth/login`
2.  **Body (JSON):**
    ```json
    {
        "username": "usuario_prueba",
        "password": "miPasswordSeguro123"
    }
    ```
3.  **Resultado esperado:** `200 OK` y un objeto que contiene el **`accessToken`** (corto) y el **`refreshToken`** (largo). **Guarda ambos tokens.**

#### Paso 3: Acceder a una Ruta Protegida (Obtener Perfil)

Utiliza el `id` del Paso 1 y el **`accessToken`** del Paso 2.

1.  **Ruta:** `GET http://localhost:3000/api/usuarios/:id`
2.  **Headers:**
      * `Authorization`: `Bearer <TU_ACCESS_TOKEN_AQUÍ>`
3.  **Resultado esperado:** `200 OK` y los datos del perfil si el ID de la ruta coincide con el ID del token.
      * **Prueba de Fallo (Autorización):** Si intentas usar un ID de otro usuario, obtendrás `403 Forbidden`.
      * **Prueba de Fallo (Autenticación):** Si no envías el token, obtendrás `401 Unauthorized`.

#### Paso 4: Subir una Imagen de Perfil

Utiliza el mismo `id` y el **`accessToken`**.

1.  **Ruta:** `POST http://localhost:3000/api/usuarios/:id/imagen`
2.  **Headers:**
      * `Authorization`: `Bearer <TU_ACCESS_TOKEN_AQUÍ>`
3.  **Body (form-data):**
      * **Clave:** `imagen`
      * **Tipo:** `File`
      * **Valor:** Selecciona un archivo de imagen (`.jpg`, `.png`, etc.) de menos de 5MB.
4.  **Resultado esperado:** `200 OK` y la URL de la imagen subida. El archivo se almacenará en la carpeta `uploads/`.

#### Paso 5: Renovar el Token de Acceso (Refresh Token)

Simulamos que el `accessToken` ha expirado (o puedes esperar 15 minutos).

1.  **Ruta:** `POST http://localhost:3000/api/auth/refresh`
2.  **Body (JSON):**
    ```json
    {
        "refreshToken": "<TU_REFRESH_TOKEN_AQUÍ>"
    }
    ```
3.  **Resultado esperado:** `200 OK` y un **nuevo `accessToken`**. Este es el mecanismo para que el usuario permanezca autenticado sin reingresar credenciales.

-----

**Desarrollado con 💻 por [Tu Nombre]**

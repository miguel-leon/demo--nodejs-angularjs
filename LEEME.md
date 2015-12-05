demo--nodejs-angularjs
======================

Demo de aplicaciones de cliente y servidor independientes con login y CRUD de usuarios usando API REST

La aplicación de servidor usa Express, base de datos MySQL, ORM SequelizeJS, bcrypt para el cifrado de las contraseñas y jsonwebtoken para la autenticación.
La aplicación cliente usa AngularJS, Bootstrap y mi propia librería dependency-loader para agregar etiquetas de script automáticamente.

[Haz click aquí para probar este demo!](https://nodejsangularjsdemo-mleon.rhcloud.com)


Características
---------------

Las siguientes son algunas características del desarrollo dignas de mencionar:

 - Dos aplicaciones totalmente independientes, sin tener conocimiento una de la otra
 - La aplicación cliente es una aplicación de una sola página como es esperado de las aplicaciones AngularJS
 - Utiliza rutas url de HTML5
 - Autenticación mediante un token. El servidor no tiene que guardar el estado del cliente
 - Regeneración del token de autenticación después de que el usuario que inició sesión ha sido modificado
 - Archivos de configuración en ambas aplicaciones cliente y servidor para evitar hard code y redundancia
 - Validación de los formularios en la aplicación cliente y validación de los datos de las peticiones en el servidor
 - Uso de una directiva de elemento personalizada para los campos de los formularios que agrega etiquetas y validación. Reutiliza el código, hace el html más claro, más legible y auto explicativo. La directiva combina el contenido de lo que encierra con el contenido de una parcial, por lo que se puede configurar fácilmente. Es bastante mágica :star:

 - En la aplicación servidor, los "providers", módulos usados para implementar comportamientos como seguridad con bcrypt, autenticación con jsonwebtoken o acceso a base de datos con SequelizeJS; pueden ser intercambiados, lo que significa que cualquiera de los tres proveedores puede ser cambiado a una implementación diferente sin necesidad de cambiar nada en el resto del código. Solamente basta implementar la interfaz documentada e indicar el proveedor en el archivo de configuración. :star:
 - El servidor envía la aplicación cliente incluso si el url es inválido a causa de la falta de conocimiento de las rutas del cliente
 - El servidor envía una descripción exhaustiva de la api cuando se acceden rutas desconocidas precedidas de `/api`. Esto se puede considerar como documentación, lo que facilita el entendimiento de cómo usar la api. :star:
 - El servidor maneja errores efectivamente de manera que no se aborta incluso si el servidor de base de datos no está disponible
 - Excelente diseño y codificación de la cadena de promesas de los middleware de la api en la aplicación servidor. Es agradable a la vista :star:

 - Buena documentación del código
 - En general, el código es bastante legible y bien distribuido

Utilización
-----------

### Instalando la aplicación

Instalar las dependencias con:

    npm install

Preparar la base de datos con:

    npm run-script prepare
    
o también

    node server/database/migration.js

No olvidar iniciar el servidor de base de datos antes.

### Ejecutando la aplicación

Iniciar la aplicación servidor con:

    npm start
    
o también

    node server/server.js

Luego acceder a `http://localhost:3000` en el navegador


Reglas de negocio
-----------------

Este demo fue creado originalmente para cumplir con un requisito para una entrevista de trabajo.
 El modelo de datos y algunas de las tecnologías fueron requerimientos específicos.
 Los campos Profile y Holding están solo para demostrar conocimientos en el manejo de relaciones entre tablas.
 De momento, estos campos no agregan ninguna lógica al negocio.
 - El usuario que inició sesión no puede ser eliminado
 - El campo email es único
 - Todos los campos del usuario son obligatorios
 - Antes de iniciar sesión, la única opción disponible es crear un nuevo usuario


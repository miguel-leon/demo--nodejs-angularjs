demo--nodejs-angularjs
======================

Demo de aplicaciones de cliente y servidor independientes con login y CRUD de usuarios usando API REST

La aplicaci�n de servidor usa Express, base de datos MySQL, ORM SequelizeJS, bcrypt para el cifrado de las contrase�as y jsonwebtoken para la autenticaci�n.
La aplicaci�n cliente usa AngularJS, Bootstrap y mi propia librer�a dependency-loader para agregar etiquetas de script autom�ticamente.

[Haz click aqu� para probar este demo!](https://nodejsangularjsdemo-mleon.rhcloud.com)


Caracter�sticas
---------------

Las siguientes son algunas caracter�sticas del desarrollo dignas de mencionar:

 - Dos aplicaciones totalmente independientes, sin tener conocimiento una de la otra
 - La aplicaci�n cliente es una aplicaci�n de una sola p�gina como es esperado de las aplicaciones AngularJS
 - Utiliza rutas url de HTML5
 - Autenticaci�n mediante un token. El servidor no tiene que guardar el estado del cliente
 - Regeneraci�n del token de autenticaci�n despu�s de que el usuario que inici� sesi�n ha sido modificado
 - Archivos de configuraci�n en ambas aplicaciones cliente y servidor para evitar hard code y redundancia
 - Validaci�n de los formularios en la aplicaci�n cliente y validaci�n de los datos de las peticiones en el servidor
 - Uso de una directiva de elemento personalizada para los campos de los formularios que agrega etiquetas y validaci�n. Reutiliza el c�digo, hace el html m�s claro, m�s legible y auto explicativo. La directiva combina el contenido de lo que encierra con el contenido de una parcial, por lo que se puede configurar f�cilmente. Es bastante m�gica :star:

 - En la aplicaci�n servidor, los "providers", m�dulos usados para implementar comportamientos como seguridad con bcrypt, autenticaci�n con jsonwebtoken o acceso a base de datos con SequelizeJS; pueden ser intercambiados, lo que significa que cualquiera de los tres proveedores puede ser cambiado a una implementaci�n diferente sin necesidad de cambiar nada en el resto del c�digo. Solamente basta implementar la interfaz documentada e indicar el proveedor en el archivo de configuraci�n. :star:
 - El servidor env�a la aplicaci�n cliente incluso si el url es inv�lido a causa de la falta de conocimiento de las rutas del cliente
 - El servidor env�a una descripci�n exhaustiva de la api cuando se acceden rutas desconocidas precedidas de `/api`. Esto se puede considerar como documentaci�n, lo que facilita el entendimiento de c�mo usar la api. :star:
 - El servidor maneja errores efectivamente de manera que no se aborta incluso si el servidor de base de datos no est� disponible
 - Excelente dise�o y codificaci�n de la cadena de promesas de los middleware de la api en la aplicaci�n servidor. Es agradable a la vista :star:

 - Buena documentaci�n del c�digo
 - En general, el c�digo es bastante legible y bien distribuido

Utilizaci�n
-----------

### Instalando la aplicaci�n

Instalar las dependencias con:

    npm install

Preparar la base de datos con:

    npm run-script prepare
    
o tambi�n

    node server/database/migration.js

No olvidar iniciar el servidor de base de datos antes.

### Ejecutando la aplicaci�n

Iniciar la aplicaci�n servidor con:

    npm start
    
o tambi�n

    node server/server.js

Luego acceder a `http://localhost:3000` en el navegador


Reglas de negocio
-----------------

Este demo fue creado originalmente para cumplir con un requisito para una entrevista de trabajo.
 El modelo de datos y algunas de las tecnolog�as fueron requerimientos espec�ficos.
 Los campos Profile y Holding est�n solo para demostrar conocimientos en el manejo de relaciones entre tablas.
 De momento, estos campos no agregan ninguna l�gica al negocio.
 - El usuario que inici� sesi�n no puede ser eliminado
 - El campo email es �nico
 - Todos los campos del usuario son obligatorios
 - Antes de iniciar sesi�n, la �nica opci�n disponible es crear un nuevo usuario


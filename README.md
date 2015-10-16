demo--nodejs-angularjs
======================

Demo of independent client and server apps with user login and CRUD for users using a RESTful API

Server app uses Express, MySQL database, SequelizeJS ORM, bcrypt for password encryption and jsonwebtoken for authentication.
Client app uses AngularJS, Bootstrap and my own dependecy-loader library to automatically add script tags.

Para ver el archivo readme en español, ver LEEME.md

Features
--------

The following are some features of development worthy of mention:

 - Two application totally independent, without knowledge of one from the other
 - Client app is a single page app as expected from an AngularJS app
 - Uses HTML5 url routing
 - Authentication via authentication token. The server doesn't have to save the state of the client
 - Authentication token regeneration after the logged user has been modified
 - Configuration files for both client and server apps to avoid hard coding and redundancy
 - Validation of forms in the client and validation of the request in the server
 - Use of a custom angular element directive for form fields that adds labels and validation. Reuses code, makes the html cleaner, more legible and self-explanatory. The directive combines content from what's enclosed by it with content from a partial, so it is easily configurable. Pretty magical :star:

 - In the server app, the "providers", modules used to implement behaviors like bcrypt security, jsonwebtoken authentication or SequelizeJS database; can be swapped, meaning that any of the three can be changed to a different implementation without needing to change any of the rest of the code. Only implementing the documented interface and indicating the provider in the config file. :star:
 - The server dispatch the client app even if url is invalid because of the lack of knowledge of the client routes
 - The server dispatch a comprehensive description of the api when accessing unknown url routes preceded with `/api`. This can be considered documentation, which facilitates the understanding on how to use the api. :star:
 - The server handle errors effectively so it doesn't crash even if the database is unavailable
 - Excellent design and codification of promise chains of api middlewares in server app. It's pleasant to the eye :star:

 - Good documentation of the code
 - In general, the code is pretty legible and well laid out

Usage
-----

### Installing the Application

Install dependencies with:

    npm install

Prepare the database with:

    npm run-script prepare

or

    node server/database/migration.js

Don't forget to start the database server before.

### Running the Application

Starting the server app with:

    npm start

or

    node server/server.js
	
then go to `http://localhost:3000` in the web browser


Business Rules
--------------

 - The logged user can't be deleted
 - The field email is unique
 - All user fields are required
 - Without logging in, the only available option is create a new user
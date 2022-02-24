# Express.js REST API Server with JWT Auth

This is a boilerplate for projects requiring JWT Auth on an Express.js API Server.

The authentication and validation servers are run seperatly on seperate ports.

* Project status: working/prototype
* Developed by Andrew Tite

  andrewtite@gmail.com

  [<img src="https://img.shields.io/badge/gmail-%23DD0031.svg?&style=for-the-badge&logo=gmail&logoColor=white"/>](mailto:andrewtite@gmail.com)


## Installation

To install the required dependencies:

* Clone git repo
* Make sure latest node and npm are installed
* From the command line: `npm i`
* Create a file `.env` with the required environment variables. (see example below)

### .env file
TOKEN_SERVER_PORT = 4000

PORT = 5000

ACCESS_TOKEN_SECRET = `USE YOUR OWN TOKEN UNIQUE TO YOUR WEBSITE`

REFRESH_TOKEN_SECRET = `USE YOUR OWN TOKEN UNIQUE TO YOUR WEBSITE`


### Creating Your Tokens for .env file
`ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` should be unique to your website.

You can easily generate new tokens from the command line:
``` 
$ node
  > require("crypto").randomBytes(64).toString("hex")
```

## Usage

You must have both the Auth Server and Validation Server running.

They run as separate servers on ports 4000 and 5000 but share the same .env file allowing them to access the same tokens.

There are 3 ways you can start the servers.
This can be handy! You can run them together or run the Auth Server and Validation Server on completely different servers, 
as long as the secret ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET 
are the same on both servers.

1. Run both servers concurrently using `npm start`

2. Run only Auth Server using `npm run authServer`

   (You will need to run the Validation server separately)

3. Run only Validation Server using `npm run authServer`

   (You will need to run the Auth server separately)

## Testing

You see it working using Postman or similar tool used for sending REST API calls. (https://www.postman.com)

Use the API Calls listed below to see your REST API in action.

1. Create a new API user 

    `localhost:4000/createUser`

2. Obtain API Token and Refresh Token  

    `localhost:4000/login`

3. Attempt to access posts using API Token using 

    `localhost:5000/posts`

4. After 15 minutes API Token will expire.

    Use valid Refresh Token to obtain new API Token and Refresh Token.

   `localhost:4000/refreshToken`

4. After 20 minutes Refresh Token will expire.

    Obtain new API Token and Refresh Token

    `localhost:4000/login`


5. You can logout the session before the 20 minute Refresh Token expiry time using a valid Refresh Token.

   `localhost:4000/logout`
    
## Available API Calls

### Auth: createUser

`localhost:4000/createUser`

Create a new API user, used to obtain a new API Access Key and Refresh Key

method: `POST`

contentType: `application/json`

body:
```
{
    "name": "joe",
    "password": "password"
}
```

cURL example: 
```
curl --location --request POST 'localhost:4000/createUser' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "joe",
    "password": "password"
}'
```

### Auth: login

`localhost:4000/login`

Obtain a new API Access Key and Refresh Key using user, created using createUser call.

API Token will expire after 15 minutes.

Refresh Token will expire after 20 minutes.

method: `POST`

contentType: `application/json`

body:
```
{
    "name": "joe",
    "password": "password"
}
```

cURL example:
```
curl --location --request POST 'localhost:4000/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "joe",
    "password": "password"
}'
```

### Auth: refreshToken

`localhost:4000/refreshToken`

Obtain a new API Access Key and Refresh Key using a valid username and refresh token combination.

method: POST

contentType: application/json

body:
```
{
    "name": "joe",
    "token": "your valid refresh token goes here"
}
```

cURL example:
```
curl --location --request POST 'localhost:4000/refreshToken' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "joe",
    "token": "eyJhbIUz...TzS9Us"
}'
```

### Auth: logout

`localhost:4000/logout`

Remove refresh token from valid refresh tokens, logging out user.

method: DELETE

contentType: application/json

body:
```
{
    "token": "your valid refresh token goes here"
}
```

cURL example:
```
curl --location --request DELETE 'localhost:4000/logout' \
--header 'Content-Type: application/json' \
--data-raw '{
    "token": "eyJhbIUz...TzS9Us"
}'
```

### Validate: posts

`localhost:5000/posts`

Try to access posts using API access provided by Auth server.

method: GET

authorization type: OAuth 2.0

header prefix: Bearer

contentType: application/json

cURL example: 
```
curl --location --request GET 'localhost:5000/posts' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGci...Nc9lQSxw'
```
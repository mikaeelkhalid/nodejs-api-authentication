# NodeJs API Authentication 

This is an Authentication API using JWT's that you can plug inside your current project or you can start with a new one. Email & Password is used for authentication.

The API based on Node.js, Express, MongoDB & Redis, following the **MVC pattern** i.e. Model ~~View~~ Controller.

**Mongoose** is used for storing Users in Database.
**Redis** is used for storing Refresh Tokens - to validate them as well at the same time Blacklist them.

---

## To start setting up the project

Step 1: Clone the repo

```bash
https://github.com/mikaeelkhalid/nodejs-api-authentication.git
```

Step 2: cd into the cloned repo and run:

```bash
npm i
```

Step 3: Put your credentials in the .env.sample and rename to .env file.

```bash
PORT=
MONGODB_URI=
DB_NAME=YOUR_DB_NAME
ACCESS_TOKEN_SECRET=GENERATE_FROM_GENERATE_NPM_RUN_KEY
REFRESH_TOKEN_SECRET=GENERATE_FROM_GENERATE_NPM_RUN_KEY
```

Step 4: To generate 256-bit keys for JWT

```bash
npm run key
```

Step 5: Install Redis (Linux Ubuntu)

```bash
sudo apt-get install redis-server
```

Step 6: Run Redis Server (Linux Ubuntu)

```bash
redis-server
```

Step 7: Install MongoDB (Linux Ubuntu)

See <https://docs.mongodb.com/manual/installation/> for more infos

Step 8: Run Mongo daemon

```bash
sudo service mongod start
```

Step 9: Start API

```bash
npm run dev
```

Step 10 (Optional): Change the expiration time of Access Token and Refresh Token according to your needs by going inside the **`./helpers/jwtHelper.js`** file.

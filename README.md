# RAGE Multiplayer gamemode template
This is RageMP start server template. It's using typescript (server-side and client-side), Vue.js for CEF and including simple log in/sign up system.

## Preview

- Login screen: https://i.imgur.com/8TLX5O1.jpg
- Loading screen: https://i.imgur.com/GuQMeYt.jpg
- First Spawn: https://i.imgur.com/7l4KY5T.jpg

## Install
- Set the SQL credentials in a `.env` file in the root folder. See: [.env.example](.env.example)
- Download and install dependencies: `npm install`
- Build: `npm run build`.
- Copy, move or symlink the `node_modules` folder and the folders inside `dist` into the root directory from the server.
- Run the server.

## Fork differences from the original repo
- Updated build scripts.
- Removed mail confirmation on register and login.
- Improved SQL security and fixed errors on register.
- Modified password hashing algorithm from AES-256 to PBKDF2 with SHA-256.
- Added salt in user passwords.
- Added `dotenv-webpack` plugin for database configuration outside the repository.

## See also
- [fedemahf/docker-ragemp](https://github.com/fedemahf/docker-ragemp) - Simple Docker container for RAGE Multiplayer
- [fedemahf/docker-ragemp-mysql](https://github.com/fedemahf/docker-ragemp-mysql) - Simple Docker container for RAGE Multiplayer and MySQL

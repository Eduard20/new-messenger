# Messenger App

## 1 Local Development

- Install node version `14.13.0`
- Create `.env` file (see 1.1 ENV Variables)
- `yarn install`
- `yarn start`
- Server is running on `localhost:9000`

When you have started the server now you can run clients as many as you want 
with calling:

- `yarn client`

### 1.1 ENV Variables

Define ENV variables in `.env` file (create the file if it don't exist).

- PORT=`9000`
- NODE_ENV=`development`

## 2 Code Styling / Linting

### 2.1 ESLint

- Run \$`yarn lint` to fix eslint issues
- Better: integrate Eslint in your text editor https://eslint.org/docs/user-guide/integrations

### 2.2 Prettier

- Run \$`yarn prettier` to run prettier checks
- Better: integrate Prettier in your text editor https://prettier.io/docs/en/editors.html

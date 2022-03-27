# booking-system-demo

Source code for the Demo Purpose, a one day booking system
[demo](https://booking-system-demo.vercel.app/)

## Tech use:
1. Fauna DB
2. NextJs
3. Auth0

## Getting Started

1. [Sign up for a free account at FaunaDB](http://bit.ly/jqqfauna).

2. Create a collection in Fauna called `bookings` and a token secret (more info on tokens)[https://docs.fauna.com/fauna/current/security/tokens.html].

3. [Sign up for a free account at Auth0](http://bit.ly/jqqauth0).

4. Create an application in Auth0 and jot down your domain, client Id, and client secret. [more details on setup + configuration](https://github.com/auth0/nextjs-auth0).

5. Copy the `.env.local.example` file to `.env.local` and include your credentials.

- **FAUNA_SECRET**: your fauna token
- **AUTH0_SECRET**: A long secret value used to encrypt the session cookie. You can generate a suitable string using openssl rand -hex 32 on the command line
- **AUTH0_BASE_URL**: The base URL of your application.
- **AUTH0_ISSUER_BASE_URL**: The URL of your Auth0 tenant domain. If you are using a Custom Domain with Auth0, set this to the value of your Custom Domain instead of the value reflected in the "Settings" tab.
- **AUTH0_CLIENT_ID**: Your Auth0 application's Client ID.
- **AUTH0_CLIENT_SECRET**: Your Auth0 application's Client Secret.

6. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker Build
1. create `.env.development` to store the env for build
2. run `docker-compose up`


## ToDo:
1. add more features: sorting, filtering,...and many more
2. change to TS
3. tests on backend
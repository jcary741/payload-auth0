# Payload Auth0 Plugin


<a href="LICENSE">
  <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" alt="Software License" />
</a>
<a href="https://github.com/chrisAlwinYS/payload-auth0/issues">
  <img src="https://img.shields.io/github/issues/chrisAlwinYS/payload-auth0.svg" alt="Issues" />
</a>

[//]: # (<a href="https://npmjs.org/package/payload-oauth2">)

[//]: # (  <img src="https://img.shields.io/npm/v/payload-oauth2.svg?style=flat-squar" alt="NPM" />)

[//]: # (</a>)

## This Package is still in development and will likely change.

# Features

- ✅ Compatible with Payload v3
- 🔐 Configures Auth0 login with payload CMS


# Wishlist/Roadmap

- ~~Add meta-data support and syncing~~
- Able to change the collection auth settings.
- ~~Ability to customize login button.~~
- Auto login functionality.
- Reduce the size of the package if possible.
- Increase the testing coverage.
- ... any other fixes


# Installation

This package uses the [NextJs Auth0](https://github.com/auth0/nextjs-auth0) plugin currently a beta version and adds the Payload Auth around it so
that it can use the payload cookie auth.

From the Nextjs Auth0 package:

Add the following environment variables to your `.env.local` file:

```dotenv
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_SECRET=
APP_BASE_URL=
```

The `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, and `AUTH0_CLIENT_SECRET` can be obtained from the [Auth0 Dashboard](https://manage.auth0.com) once you've created an application. **This application must be a `Regular Web Application`**.

The `AUTH0_SECRET` is the key used to encrypt the session and transaction cookies. You can generate a secret using `openssl`:

```shell
openssl rand -hex 32
```

The `APP_BASE_URL` is the URL that your application is running on. When developing locally, this is most commonly `http://localhost:3000`.

> [!IMPORTANT]
> You will need to register the follwing URLs in your Auth0 Application via the [Auth0 Dashboard](https://manage.auth0.com):
>
> - Add `http://localhost:3000/auth/callback` to the list of **Allowed Callback URLs**
> - Add `http://localhost:3000` to the list of **Allowed Logout URLs**


Middleware file needed, exactly like NextJS docs:

```typescript
import { NextRequest, NextResponse} from 'next/server'

import { auth0 } from "payload-auth0/node"

export async function middleware(request: NextRequest) {
  return await auth0.middleware(request)
}

export const config = {
  matcher: [
    "/(auth|admin)/(login|logout|callback|profile|access-token|backchannel-logout)",
  ],
}
```

Installing the package

```
npm install payload-auth0
yarn install payload-auth0
pnpm install payload-auth0
```

### Plugin Options

*Note: There are more options defined however they all are not all tested or implemented correctly.*

```typescript jsx
{
  enabled: boolean;

  strategyName: string;

  button = {
    component: PayloadComponent,
    text: string,
    className: string
  };

  hooks: {
    afterLogin: {
      handler(session, payload)
    }
  }
}
```


# Contributing

  More to come

# License

The MIT License (MIT). Please see [License File](LICENSE) for more information.

# Credits

This package was inspired by [payload-oauth2](https://github.com/wilsonle/payload-oauth2).

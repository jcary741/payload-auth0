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


# Installation

ENV fields needed: (subject to change an updates)
```dotenv
AUTH0_SECRET='{STRING}'
AUTH0_BASE_URL='http://{URL}.com'
AUTH0_ISSUER_BASE_URL='https://xxx-xxxxxxxxxxxxx.xx.auth0.com'
AUTH0_CLIENT_ID='{STRING}'
AUTH0_CLIENT_SECRET='{STRING}'
AUTH0_CALLBACK="/api/users/auth/callback"


AUTH0_DOMAIN='xxx-xxxxxxxxxxxxx.xx.auth0.com'
APP_BASE_URL='https://{URL}.com'```

```

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

**NOT LIVE YET**

```
npm install payload-auth0
yarn install payload-auth0
pnpm install payload-auth0
```

# Contributing

  More to come

# License

The MIT License (MIT). Please see [License File](LICENSE) for more information.

# Credits

This package was inspired by [payload-oauth2](https://github.com/wilsonle/payload-oauth2).

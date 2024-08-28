<div align="center">
  <br />
  <p>
    <a href="#"><img src="https://d3405rr50k8fph.cloudfront.net/assets/packs/media/src/img/aj_classic_logo-c23358b148924ec6aa392e8e315bc3a2.svg" width="200" alt="Netify.js" /></a>
  </p>
  <br />
</div>

This is a TypeScript client for the `private` Animal Jam Classic API. This client is far from finished, but it still comes with some cool features.

- Decoding defpacks.
- Decoding audio files.
- Decoding rooms.
- Unpacking asar files.
- Packing asar files.
- Fetching flashvars.
- Networking client (handles most of the communication with the server).

# Table of Contents

- [Install](#install)
- [Examples](#examples)

# Install

From npm

```
npm install animaljam.js
```

# Examples

You can find all usage examples [here](examples).

Here is how to decode a defpack.

```typescript
import { AnimalJamClient } from 'animaljam.js';

(async () => {
  const client = new AnimalJamClient()

  const defpack = await client.defpack.decode('1030', {
    type: 'titleStrId', // Defpack type
  })

  console.log(defpack) // Decoded defpack object
})()
```

Here is how to make a simple networking client.

```typescript
import { AnimalJamClient } from 'animaljam.js'

(async () => {
  const screen_name = 'screen_name'
  const password = 'password'

  const client = new AnimalJamClient()

  /**
   * Flashvars
   */
  const flashvars = await client.flashvars.fetch()

  /**
   * Authenticate the client.
   */
  const { auth_token } = await client.authenticator.login({
    screen_name: screen_name,
    password: password,
    domain: 'flash', // Optional, defaults to flash if not specified
  })


  /**
   * Networking handles most of the communication with the server.
   */
  const networking = await client.networking.createClient({
    host: flashvars.smartfoxServer,
    port: flashvars.smartfoxPort,

    auth_token: auth_token,
    screen_name: screen_name,
    deploy_version: flashvars.deploy_version,
    domain: 'flash', // Optional, defaults to flash if not specified
  })


  await networking.createConnection()
  console.log('Connected to server!')
  
  networking.on('message', (message) => {
    console.log('Received message from server', message.toMessage())
  })
  
  networking.on('close', () => {
    console.log('Connection closed')
  })
})()
```
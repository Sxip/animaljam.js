<div align="center">
  <br />
  <p>
    <a href="#"><img src="https://d3405rr50k8fph.cloudfront.net/assets/packs/media/src/img/aj_classic_logo-c23358b148924ec6aa392e8e315bc3a2.svg" width="200" alt="Netify.js" /></a>
  </p>
  <br />
</div>

**AnimalJam.js** is a comprehensive TypeScript client primarily designed for interacting with the private **Animal Jam Classic API**, yet it also extends its capabilities to handle **Animal Jam Play Wild** networking and login features. Although the project is still in active development, it already includes an exciting set of features for both games!

- 🗂️ **Defpack Decoding**  
  Decode defpack files to extract valuable data.
  
- 🎵 **Audio File Decoding**  
  Support for decoding in-game audio assets.
  
- 🏠 **Room Decoding**  
  Decode and explore room data.
  
- 📦 **Asar File Handling**  
  Unpack and repack `.asar` files with ease.
  
- 🌐 **Networking Client**  
  Seamlessly handle communication with the servers for both **Animal Jam Classic** and **Animal Jam Play Wild**.
  
- 🔑 **HMAC Support**  
  Built-in HMAC generation for secure communication in **Animal Jam Play Wild**.
  
- 🖼️ **Masterpiece Encoder**  
  Encode masterpieces into `aja2id` and `ajg1id` formats.
  
- 🛡️ **Proxy Support & Testing**  
  Integrated proxy support with a built-in proxy tester.

---

# Table of Contents

- [Install](#install)
- [Examples](#examples)
---

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
<div align="center">
  <br />
  <p>
    <a href="#"><img src="https://github.com/user-attachments/assets/aaa0e7c1-5071-4f58-bb67-e04500edd072" width="400" /></a>
  </p>
  <br />
</div>

**AnimalJam.js** is a comprehensive TypeScript client primarily designed for interacting with the private **Animal Jam Classic API**, yet it also extends its capabilities to handle **Animal Jam Play Wild** wildworks and login features. Although the project is still in active development, it already includes an exciting set of features for both games!

- 🗂️ **Defpack Decoding**  
  Decode defpack files to extract valuable data.
- 🎵 **Audio File Decoding**  
  Support for decoding in-game audio assets.
- 🏠 **Room Decoding**  
  Decode and explore room data.
- 📦 **Asar File Handling**  
  Unpack and repack `.asar` files with ease.
- 🌐 **Wildworks Client**  
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
import { AnimalJamClient } from "animaljam.js";

(async () => {
  const client = new AnimalJamClient();

  const defpack = await client.defpack.decode("1030", {
    type: "titleStrId", // Defpack type
  });

  console.log(defpack); // Decoded defpack object
})();
```

Here is how to make a simple wildworks client.

```typescript
import { AnimalJamClient } from "animaljam.js";

(async () => {
  const screen_name = "screen_name";
  const password = "password";

  const client = new AnimalJamClient();

  /**
   * Flashvars
   */
  const flashvars = await client.flashvars.fetch();

  /**
   * Authenticate the client.
   */
  const { auth_token } = await client.authenticator.login({
    screen_name: screen_name,
    password: password,
    domain: "flash", // Optional, defaults to flash if not specified
  });

  /**
   * Wildworks handles most of the communication with the server.
   */
  const wildworks = await client.wildworks.createClient({
    host: flashvars.smartfoxServer,
    port: flashvars.smartfoxPort,

    auth_token: auth_token,
    screen_name: screen_name,
    deploy_version: flashvars.deploy_version,
    domain: "flash", // Optional, defaults to flash if not specified
  });

  await wildworks.connect();
  console.log("Connected to server!");

  wildworks.on("message", (message) => {
    console.log("Received message from server", message.toMessage());
  });

  wildworks.on("close", () => {
    console.log("Connection closed");
  });
})();
```

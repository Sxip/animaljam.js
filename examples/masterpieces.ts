import { XTMessage } from 'src/repositories/networking/messages/XTMessage'
import { AnimalJamClient } from '../src'

/**
 * This example shows how to connect to the Animal Jam server and fetch masterpieces.
 */
(async () => {
    /**
     * This account will probably be banned.
     * Use your own account.
     */
    const screen_name = 'screen_name'
    const password = 'password'

    /**
     * This is the username to fetch masterpieces for.
     * You can use any username, but this is the one used in the example.
     */
    const username_for_masterpieces = 'ajhq'
  

    /**
     * Create a new Animal Jam client.
     */
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
  
      // This proxy will not work for you, remove if you don't need a proxy or add your own
      proxy: {
        host: '104.167.24.75',
        port: 3128,
      },
    })
  
  
    await networking.connect()
    console.log('Connected to server!')
    

    /**
     * Networking is ready when the connection is established.
     * This is where you can start sending messages to the server.
     */
    networking.on('ready', async () => {
      console.log('Networking is ready!')

      /**
       * Once connected, we can send messages to the server.
       * The server will respond with a message.
       */

      networking.sendXTMessage(['dmi', '0', username_for_masterpieces])

      /**
       * Sends the the dmi message to the server.
       * if you're using mobile you have to use `dMl` instead of `dmi`.
       */
      const masterpieces = await networking.waitForMessageOfType<XTMessage>({ 
        type: 'dmi', 
        timeout: 1000 
      })

      /**
       * Regex to match the masterpieces ids.
       * The ids are in the format of a UUID.
       * Example: 392bf9e9-1470-43f2-bc06-5555fa2979db
       */
      const masterpieces_ids = masterpieces.message
        .map(message => {
          const uuid = message.match(/^[a-f0-9\-]{36}$/gm)

          /**
           * If you're using mobile, use this endpoint instead:
           * `https://ajpw-ugc-prod.akamaized.net/masterpieces`
           */
          if (uuid) return `https://ajcontent.akamaized.net/masterpieces/${uuid}`
          return null
        })
        .filter(Boolean)

      console.log('Masterpieces:', masterpieces_ids)
    })
})()
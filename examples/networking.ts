import { AnimalJamClient } from '../src'

(async () => {
  /**
   * This account will probably be banned.
   * Use your own account.
   */
  const screen_name = 'sxipfox'
  const password = 'Pass12345678'

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
  
  networking.on('message', async (message) => {
    console.log('Received message from server', message.toMessage());
  })
})()
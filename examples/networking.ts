import { AnimalJamClient } from '../src'

(async () => {
  const screen_name = 'username'

  const client = new AnimalJamClient()

  /**
   * Flashvars
   */
  const flashvars = await client.flashvars.fetch()

  /**
   * Authenticate the client.
   */
  const { auth_token } = await client.authenticator.login({
    screenName: screen_name,
    password: 'password',
  })

  /**
   * Networking handles most of the communication with the server.
   */
  const networking = await client.networking.createClient({
    host: flashvars.smartfoxServer,
    port: flashvars.smartfoxPort,

    authToken: auth_token,
    screenName: screen_name,
  })


  await networking.createConnection()
  console.log('Connected to server!')
})()

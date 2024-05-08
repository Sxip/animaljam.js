import { AnimalJamClient } from '../src'

(async () => {
  const screen_name = 'niggeur'

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
    password: 'abd123',
  })

  /**
   * Networking handles most of the communication with the server.
   */
  const networking = await client.networking.createClient({
    host: flashvars.smartfoxServer,
    port: flashvars.smartfoxPort,

    authToken: auth_token,
    screenName: screen_name,
    deployVersion: flashvars.deploy_version,
  })


  await networking.createConnection()
  console.log('Connected to server!')
})()

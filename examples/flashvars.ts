import { AnimalJamClient } from '../src'

(async () => {
  const client = new AnimalJamClient()

  const flashvars = await client.flashvars.fetch()
  console.log(flashvars.smartfoxServer)
})()

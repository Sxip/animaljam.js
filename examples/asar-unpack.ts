import { AnimalJamClient } from '../src'

(async () => {
  const client = new AnimalJamClient()
  
  await client.asar.unpack()
})()

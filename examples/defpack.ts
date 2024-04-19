import { AnimalJamClient } from '../src/Client'

(async () => {
  const client = new AnimalJamClient()

  const defpack = await client.defpack.decode('10230')
  console.log(defpack)
})()

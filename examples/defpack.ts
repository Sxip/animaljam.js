import { AnimalJamClient } from '../src/Client'

(async () => {
  const client = new AnimalJamClient()

  const defpack = await client.defpack.decode('1030', {
    type: 'titleStrId',
  })

  console.log(defpack.data)
})()

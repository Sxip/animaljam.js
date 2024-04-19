import { AnimalJamClient } from '../src'

(async () => {
  const client = new AnimalJamClient()

  const defpack = await client.room.decode('jamaa_township', {
    file: 'room_main',
  })

  console.log(defpack)
})()

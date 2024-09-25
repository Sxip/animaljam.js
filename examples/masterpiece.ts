import { AnimalJamClient } from '../src'

(async () => {
  const client = new AnimalJamClient()

  await client.masterpiece.encode({
    imagePath: './examples/pepe.png',
    saveFile: true,
    saveFileMasterpiecePath: './examples/masterpieces',
    uuid: '8788a8df-d0af-4154-b8ed-24d7552a3ea0',
  })
})()

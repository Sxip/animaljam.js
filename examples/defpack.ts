import { AnimalJamClient } from '../src';

(async () => {
  const client = new AnimalJamClient()

  await client.defpack.decode('1000', {
    type: 'titleStrId',
    saveFile: true,
    saveFileDefpackPath: './test',
  })
})()

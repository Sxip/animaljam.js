import { AnimalJamClient } from '../src';

(async () => {
  const client = new AnimalJamClient()

  await client.defpack.decode('1030', {
    type: 'nameStrId',
    saveFile: true,
    saveFileDefpackPath: './test',
  })
})()

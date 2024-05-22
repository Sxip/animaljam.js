import { AnimalJamClient } from '../src';

(async () => {
  const client = new AnimalJamClient({
    deployVersion: '1683'
  })

  await client.defpack.decode('1000', {
    type: 'titleStrId',
    saveFile: true,
    saveFileDefpackPath: './test',
  })
})()

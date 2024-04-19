import { AnimalJamClient } from '../src'

(async () => {
  const client = new AnimalJamClient()

  await client.audio.decode('Mus_Art_Studio_theme', {
    saveFile: true,
    saveFileAudioPath: './test',
  })
})()

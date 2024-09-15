import { AnimalJamClient } from '../src';

(async () => {
  const client = new AnimalJamClient()

  const proxies = await client.proxy.test({
    concurrency: 10,
    proxies: [
      { type: 'socks5', host: '47.90.149.238', port: 3128 },
    ],
  })


  console.info(`Working proxies: ${proxies.filter(proxy => proxy.isWorking).length}`)
})()

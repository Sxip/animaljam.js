import { AnimalJamClient } from '../src';

(async () => {
  const client = new AnimalJamClient()

  const proxies = await client.proxy.test({
    concurrency: 10,
    timeout: 10000,
    proxies: [
      { type: 'socks5', host: '8.211.200.183', port: 9098 },
    ],
  })


  console.info(`Working proxies: ${proxies.filter(proxy => proxy.isWorking).length}`)
})()

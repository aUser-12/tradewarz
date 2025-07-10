// index.js
const fastify = require('fastify')({ logger: true })

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  console.log(`🚀 Server running at ${address}`)
})

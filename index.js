// index.js
import { authorize , signout , change_password } from "./routes/auth"
const fastify = require('fastify')({ logger: true })
const fastifyCookie = require('@fastify/cookie');
const fastifySession = require('@fastify/session');
const cron = require('node-cron')
const { processMatches } = require('elo')
fastify.register(fastifyCookie);
fastify.register(fastifySession, {
  secret: 'akhilandjimitsittingunderatree',
  cookie: { secure: false }, // set to true in production with HTTPS
  saveUninitialized: false
});
cron.schedule('*/25 * * * *', () => {
  processMatches();
}); 

fastify.get('/', async (request, reply) => {
  return { hello: 'hello world' }
})

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  console.log(` Server running at ${address}`)
})

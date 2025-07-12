// index.js
const fastify = require('fastify')({ logger: true })
const path = require('path');
const formBody = require('@fastify/formbody');
const fastifyCookie = require('@fastify/cookie');
const fastifySession = require('@fastify/session');
const cron = require('node-cron')
const { processMatches } = require('./elo');

fastify.register(formBody);
fastify.register(fastifyCookie);
fastify.register(fastifySession, {
  secret: 'akhilandjimitsittingunderatree',
  cookie: { secure: false }, // set to true in production with HTTPS
  saveUninitialized: false
});

cron.schedule('*/25 * * * *', () => {
  processMatches();
}); 
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'static'),
  prefix: '/', // URL prefix
});
fastify.get('/signup', async (request, reply) => {
  reply.sendFile('Sign in.html');
})
fastify.post('/signup', async (request, reply) => {
  const { username, password } = request.body;
  console.log('Form Data:', username, password);

  return reply.send({ success: true, username });
});
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  console.log(` Server running at ${address}`)
})

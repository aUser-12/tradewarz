// index.js
const fastify = require('fastify')({ logger: true })
const path = require('path');
const formBody = require('@fastify/formbody');
const fastifyCookie = require('@fastify/cookie');
const fastifySession = require('@fastify/session');
const cron = require('node-cron')
const { processMatches } = require('./elo');
const {authorize, change_password, signout } = require('./routes/auth')
fastify.register(formBody);
fastify.register(fastifyCookie);
fastify.register(fastifySession, {
  secret: 'onetwothreefourfivesixseveneightnineteneleventwelve',
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
fastify.get('/', async (request, reply) => {
  return reply.redirect('/signup');
});
fastify.get('/signup', async (request, reply) => {
  return reply.sendFile('auth.html');
})
fastify.post('/signup', async (request, reply) => {
  const { username, password } = request.body;
  console.log('Form Data:', username, password);
  authorize("register",username,password)
  return reply.send({ success: true, username });
});
fastify.get('/auth', async (request, reply) => {
  return reply.sendFile('signup.html');
})
fastify.post('/auth', async (request, reply) => {
  const { username, password } = request.body;
  console.log('Form Data:', username, password);
  authorize("login",username,password)
  return reply.send({ success: true, username });
});
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  console.log(` Server running at ${address}`)
})

const fastify = require('fastify')({ logger: true });
const path = require('path');
const formBody = require('@fastify/formbody');
const fastifyCookie = require('@fastify/cookie');
const fastifySession = require('@fastify/session');
const cron = require('node-cron');
const { processMatches } = require('./elo');
const { authorize, change_password, signout } = require('./routes/auth');

fastify.register(formBody);
fastify.register(fastifyCookie);
fastify.register(fastifySession, {
  secret: 'onetwothreefourfivesixseveneightnineteneleventwelve',
  cookie: { secure: false },
  saveUninitialized: false
});

cron.schedule('*/25 * * * *', () => {
  processMatches();
});

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'static'),
  prefix: '/',
});

fastify.get('/', async (request, reply) => {
  return reply.redirect('/signup');
});

fastify.get('/signup', async (request, reply) => {
  return reply.sendFile('signup.html');
});

fastify.post('/signup', async (request, reply) => {
  const { username, password } = request.body;
  const result = await authorize("register", username, password);
  return reply.send(result);
});

fastify.get('/auth', async (request, reply) => {
  return reply.sendFile('login.html');
});

fastify.post('/auth', async (request, reply) => {
  const { username, password } = request.body;
  const result = await authorize("login", username, password);
  if (result.success) {
    request.session.username = username;
  }
  return reply.send(result);
  
});

fastify.get('/changepass', async (request, reply) => {
  return reply.sendFile('change-password.html');
});

fastify.post('/changepass', async (request, reply) => {
  const { username, currentPass, newPass } = request.body;
  const result = await change_password(username, currentPass, newPass);
  return reply.send(result);
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(` Server running at ${address}`);
});
fastify.get('/dashboard', async (request, reply) => {
  const username = request.session.username;

  if (!username) {
    return reply.code(401).send({ error: 'Not logged in' });
  }

  const users = JSON.parse(fs.readFileSync('./users.json'));
  const user = users.find(u => u.username === username);

  if (!user) {
    return reply.code(404).send({ error: 'User not found' });
  }

  return {
    username: user.username,
    stats: [
      { label: "Rating (ELO)", value: user.rating },
      { label: "Total Gains", value: `$${user.totalGains}` },
      { label: "Average Return", value: `${user.avgReturn}%` },
      { label: "Win Rate", value: `${user.winRate}%` },
      { label: "Trades Made", value: user.tradesMade },
      { label: "Best Match", value: user.bestMatch }
    ],
    chartData: user.weeklyReturns,
    matchHistory: user.matchHistory
  };
});
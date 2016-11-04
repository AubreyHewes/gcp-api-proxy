import path from 'path';
import Koa from 'koa';
import KoaStatic from 'koa-static';
import Router from 'koa-router';
import fetch from 'node-fetch';

const app = new Koa();
app.keys = ['don\'t be eval', 'ugly like a turtle'];

// x-response-time

app.use(async function (ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger

// app.use(async function (ctx, next) {
//   const start = new Date();
//   await next();
//   const ms = new Date() - start;
//   console.log(`${ctx.method} ${ctx.url} - ${ms}`);
// });

// routes

const router = new Router();
router.get('/', (ctx, next) => {
  ctx.body = 'BEACHES';
});

const checkToken = (ctx, next) => {
  if (!ctx.request.query || !ctx.request.query.key) {
    // throw new Error('Key is not set!');
    ctx.body = { 'error': 'Key is not set' };
    return;
  }
  next();
};

router.get('/api/:endpoint', checkToken, (ctx, next) => {
  fetch('https://www.google.com/cloudprint/' + ctx.params.endpoint + '?key=' + ctx.query.key).then((response) => {

    console.log(response);
  }).catch((err) => {

    console.log(response);
  });

  ctx.body = { 'body': 'API BEACHES' };
}).post('/api/:endpoint', checkToken, (ctx, next) => {
  ctx.body = { 'body': 'API BEACHES' };
});

// // public files
//
// const publicFiles = KoaStatic(path.join(__dirname, 'public'));
// publicFiles._name = 'static /public';
// app.use(publicFiles);

// response
app.use(router.routes()).use(router.allowedMethods());

app.on('error', err =>
  console.error('server error', err)
);

export default app;

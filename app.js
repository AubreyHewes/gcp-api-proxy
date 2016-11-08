// import path from 'path';
import Koa from 'koa';
// import KoaStatic from 'koa-static';
import Router from 'koa-router';
import gcpApiProxy from './middleware/gcp-api-proxy';

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

router.get('/api/:endpoint', gcpApiProxy).post('/api/:endpoint', gcpApiProxy);

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

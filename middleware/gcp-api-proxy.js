import fetch from 'node-fetch';

const getParsedBody = (ctx) => {
  let body = ctx.request.body;
  if (body === undefined || body === null) {
    return undefined;
  }
  const contentType = ctx.request.header['content-type'];
  if (!Buffer.isBuffer(body) && typeof body !== 'string') {
    if (contentType && contentType.indexOf('json') !== -1) {
      body = JSON.stringify(body);
    } else {
      body = body + '';
    }
  }
  return body;
};

const gcpApiProxy = async (ctx, next) => {
  const start = new Date();

  if (!ctx.request.query || !ctx.request.query.access_token) {
    ctx.body = { 'success': false, 'message': 'access_token is not set' };
    return;
  }

  await fetch('https://www.google.com/cloudprint/' + ctx.params.endpoint + '?' + ctx.request.querystring, {
    method: ctx.request.method,
    headers: {
      'X-CloudPrint-Proxy': 'gcp-api-proxy/0.0.1 (+https://github.com/AubreyHewes/gcp-api-proxy)',
      'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      'Content-Type': ctx.request.contentType,
      'User-Agent': ctx.request.headers['user-agent'] ? ctx.request.headers['user-agent'] : 'unknown'
    },
    body: getParsedBody(ctx)
  }).then((res) => {
    if (res.status !== 200) {
      return { 'success': false, 'message': res.statusText };
    }
    return res.json();
  }).then((body) => {
    ctx.body = body;
  }).catch((err) => {
    // ctx.body = { 'success': false, 'message': err.message };
    throw err;
  });
  ctx.set('X-GCP-Response-Time', `${new Date() - start}ms`);
};

export default gcpApiProxy;

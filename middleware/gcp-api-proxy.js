import fetch from 'node-fetch';

const gcpApiProxy = async (ctx, next) => {
  if (!ctx.request.query || !ctx.request.query.access_token) {
    ctx.body = { 'success': false, 'message': 'access_token is not set' };
    return;
  }
  await fetch('https://www.google.com/cloudprint/' + ctx.params.endpoint + '?' + ctx.request.querystring, {
    method: ctx.request.method,
    headers: {
      'X-CloudPrint-Proxy': 'gcp-api-proxy/0.0.1 (+https://github.com/AubreyHewes/gcp-api-proxy)'
    }
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
};

export default gcpApiProxy;

const Koa = require('koa');
const app = new Koa();

app.use(async (ctx) => {
  let title = 'İndex';
  if (ctx.path === '/hakkimda') {
    title = 'Hakkımda';
  } else if (ctx.path === '/iletisim') {
    title = 'İletişim';
  }

  ctx.body = `<h1>${title} sayfasına hoşgeldiniz</h1>`;
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
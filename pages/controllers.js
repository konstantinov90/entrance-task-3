module.exports.index = function(req, res) {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Переговорки</title>
      <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
  </head>
  <body>
      <div id="app">
        <router-view></router-view>
      </div>
      <script src="/scripts/build.js"></script>
  </body>
  </html>
    `);
};

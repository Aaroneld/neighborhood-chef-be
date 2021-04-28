const url = require('url');

module.exports = function sendErrorRedirect(res, status, error, location) {
  //console.log(status, error, location);

  res.redirect(
    url.format({
      pathname: '/error',
      query: {
        status,
        location,
        stacktrace: error.stack,
        message: error.message,
        timestamp: Date.now(),
      },
    })
  );
};

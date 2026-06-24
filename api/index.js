const app = require('../app');

// Vercel (and other serverless platforms) will call this function for requests
// placed under the `/api` path when deploying the `backend` folder as the project root.
module.exports = (req, res) => {
  return app(req, res);
};

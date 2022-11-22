import * as express from 'express';

let router = express.Router();

router.get('/health', async (req, res, next) => {
  const data = {
    status: "ok"
  }
  return res.json(data);
});


export default router;

import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  // Mock metrics data
  res.json({
    carbon: 100,
    water: 150
  });
});

export const metricsRouter = router;
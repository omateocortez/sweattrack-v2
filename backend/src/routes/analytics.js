const router = require('express').Router();
const ctrl = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/dashboard', ctrl.getDashboard);
router.get('/weekly', ctrl.getWeeklyReport);
router.get('/hydration-trend', ctrl.getHydrationTrend);

module.exports = router;

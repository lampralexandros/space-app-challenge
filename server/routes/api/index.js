import express from 'express';
import authenticateRouter from './authenticate';
import userRouter from './user';
import quakeRouter from './quake.router';
const router = express.Router();

router.use('/authenticate', authenticateRouter);
router.use('/user', userRouter);
router.use('/', quakeRouter);
export default router;

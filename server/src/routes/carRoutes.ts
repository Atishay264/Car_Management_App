import express from 'express';
import * as carController from '../controllers/carController';
import { auth } from '../middleware/auth';
import { upload } from '../config/multer';

const router = express.Router();

router.get('/', auth, carController.getCars);
router.get('/:id', auth, carController.getCar);
router.post('/', auth, upload.array('images', 10), carController.createCar);
router.put('/:id', auth, upload.array('images', 10), carController.updateCar);
router.delete('/:id', auth, carController.deleteCar);

export default router;
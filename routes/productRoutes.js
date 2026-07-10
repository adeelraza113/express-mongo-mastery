import express from 'express';
import productController from '../controllers/productController.js';
import upload from '../config/upload.js';
import { protect } from '../config/authMiddleware.js';
import { validateRequest } from '../config/validateMiddleware.js'; 
import { productCreateSchema } from '../validations/productValidation.js'; 

const router = express.Router();

router.route('/performance-debug').get(productController.checkPerformance);
router.route('/stats').get(productController.getStats);
router.route('/')
    .post(
        protect, 
        upload.single('image'), 
        validateRequest(productCreateSchema), 
        productController.create)
    .get(productController.getAll);
router.route('/:id')
    .get(productController.getById)
    .put(
        protect, 
        validateRequest(productCreateSchema),  
        productController.update)
    .delete(protect, productController.delete);

router.route('/:id/reviews')
    .post(protect, productController.createProductReview);



export default router;
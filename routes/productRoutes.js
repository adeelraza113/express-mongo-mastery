import express from 'express';
import productController from '../controllers/productController.js';
import upload from '../config/upload.js';

const router = express.Router();


router.route('/')
    .post(upload.single('image'), productController.create) 
    .get(productController.getAll);

router.route('/:id')
    .get(productController.getById)
    .put(productController.update)
    .delete(productController.delete);

router.route('/:id/reviews')
    .post(productController.createProductReview);

export default router;
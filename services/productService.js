import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import Review from '../models/reviewModel.js';
import { AppError } from '../config/errorHandler.js';


class ProductService {

    async createProduct(productData) {
        const product = new Product(productData);
        return await product.save();
    }

  async getAllProducts(queryString) {
    let queryObj = { ...queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search']; 
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    let finalQuery = JSON.parse(queryStr);
    if (queryString.search) {
        finalQuery.$text = { $search: queryString.search };
    }

    let query = Product.find(finalQuery);
    if (queryString.sort) {
        const sortBy = queryString.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else if (queryString.search) {
        query = query.shadowScore ? query.sort({ score: { $meta: "textScore" } }) : query.sort('-createdAt');
    } else {
        query = query.sort('-createdAt');
    }

    const page = parseInt(queryString.page) || 1;
    const limit = parseInt(queryString.limit) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    return await query;
}

    async getProductById(id) {
        const product = await Product.findById(id);
        if (!product) return null;

        const reviews = await Review.find({ product: id });
        
        return {
            product,
            reviews
        };
    }

   async createReviewWithTransaction(reviewData) {
    const newReview = await Review.create(reviewData);
    
    const product = await Product.findById(reviewData.product);
    if (!product) {
        throw new AppError('Product not found!', 404);
    }

    product.stock = product.stock > 0 ? product.stock - 1 : 0;
    await product.save();

    return newReview;
}

    async updateProduct(id, updateData) {
        return await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }

    async getProductStats() {
        return await Product.aggregate([
            {
                $match: { price: { $gte: 0 } }
            },
            {
                $group: {
                    _id: { $toUpper: '$category' }, 
                    totalProducts: { $sum: 1 }, 
                    avgPrice: { $avg: '$price' }, 
                    minPrice: { $min: '$price' }, 
                    maxPrice: { $max: '$price' }, 
                    totalStockValue: { $sum: { $multiply: ['$price', '$stock'] } } 
                }
            },
            {
                $sort: { avgPrice: -1 }
            }
        ]);
    }

    async debugQueryPerformance(category, maxPrice) {
    const stats = await Product.find({ 
        category: category, 
        price: { $lte: maxPrice } 
    }).explain('executionStats');

    return {
        winningPlan: stats.queryPlanner.winningPlan.stage, 
        totalDocsExamined: stats.executionStats.totalDocsExamined, 
        executionTimeMillis: stats.executionStats.executionTimeMillis 
    };
}

}

export default new ProductService();
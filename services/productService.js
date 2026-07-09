import Product from '../models/productModel.js';
import Review from '../models/reviewModel.js';

class ProductService {

    async createProduct(productData) {
        const product = new Product(productData);
        return await product.save();
    }

    async getAllProducts(queryString) {
        const queryObj = { ...queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        
        let query = Product.find(JSON.parse(queryStr));
        if (queryString.sort) {
            const sortBy = queryString.sort.split(',').join(' ');
            query = query.sort(sortBy);
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

    async createReview(reviewData) {
        const review = new Review(reviewData);
        return await review.save();
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
}

export default new ProductService();
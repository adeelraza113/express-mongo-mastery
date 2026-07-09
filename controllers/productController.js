import productService from '../services/productService.js';
import { validateProductInput } from '../validations/productValidation.js';
import { getIO } from '../config/socket.js';

class ProductController {

    async create(req, res) {
        try {
            const { errors, isValid } = validateProductInput(req.body);
            if (!isValid) return res.status(400).json({ status: "fail", errors });
            const productData = { ...req.body }; 
            if (req.file) {
                productData.image = `/public/uploads/${req.file.filename}`;
            }
            const newProduct = await productService.createProduct(productData);
            const io = getIO();
            io.emit('product_created', {
                message: "A new product has been uploaded real-time!",
                product: newProduct
            });
            return res.status(201).json({ status: "success", message: "Product created successfully" });
        } catch (error) {
            return res.status(500).json({ status: "error", message: error.message });
        }
    }
   
    async getAll(req, res) {
        try {
            const products = await productService.getAllProducts(req.query);
            return res.status(200).json({ status: "success", results: products.length, data: products });
        } catch (error) {
            return res.status(500).json({ status: "error", message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const result = await productService.getProductById(req.params.id);
            if (!result) {
                return res.status(404).json({ status: "fail", message: "Product not found" });
            }
            return res.status(200).json({ status: "success", data: result });
        } catch (error) {
            return res.status(500).json({ status: "error", message: error.message });
        }
    }

    async createProductReview(req, res) {
        try {
            const { username, rating, comment } = req.body;
            const productId = req.params.id;

            if (!username || !rating || !comment) {
                return res.status(400).json({ status: "fail", message: "All review fields are required" });
            }

            const reviewData = { product: productId, username, rating, comment };
            const newReview = await productService.createReview(reviewData);

            return res.status(201).json({ status: "success", messaage: "Review added successfully" });
        } catch (error) {
            return res.status(500).json({ status: "error", message: error.message });
        }
    }

    async update(req, res) {
        try {
            const { errors, isValid } = validateProductInput(req.body);
            if (!isValid) {
                return res.status(400).json({ status: "fail", errors });
            }

            const updatedProduct = await productService.updateProduct(req.params.id, req.body);
            if (!updatedProduct) {
                return res.status(404).json({ status: "fail", message: "Product not found to update" });
            }
            return res.status(200).json({ status: "success",message: "Product updated successfully" });
        } catch (error) {
            return res.status(500).json({ status: "error", message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const deletedProduct = await productService.deleteProduct(req.params.id);
            if (!deletedProduct) {
                return res.status(404).json({ status: "fail", message: "Product not found to delete" });
            }
            return res.status(200).json({ status: "success", message: "Product deleted successfully" });
        } catch (error) {
            return res.status(500).json({ status: "error", message: error.message });
        }
    }

    async getStats(req, res, next) {
        try {
            const stats = await productService.getProductStats();
            return res.status(200).json({
                status: "success",
                data: stats
            });
        } catch (error) {
            next(error); 
        }
    }
    
}

export default new ProductController();
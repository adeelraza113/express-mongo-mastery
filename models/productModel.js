import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        default: 0
    },
    image: { 
        type: String 
    }
}, {
    timestamps: true 
});

productSchema.virtual('imageUrl').get(function() {
    if (this.image) {
        return `${process.env.BASE_URL}${this.image}`;
    }
    return null;
});


productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import Product from './models/productModel.js';
import User from './models/userModel.js';
import Review from './models/reviewModel.js';

dotenv.config();


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected for seeding...');
    } catch (error) {
        console.error('Connection failed:', error.message);
        process.exit(1);
    }
};


const importData = async () => {
    await connectDB();
    try {
        await Product.deleteMany();
        await Review.deleteMany();
        console.log(' Existing products and reviews cleared.');
        const sampleProducts = [];
        for (let i = 0; i < 20; i++) {
            sampleProducts.push({
                name: faker.commerce.productName(),
                price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
                description: faker.commerce.productDescription(),
                category: faker.helpers.arrayElement(['Electronics', 'Books', 'Clothing', 'Fitness']),
                stock: faker.number.int({ min: 0, max: 100 }),
                image: '/public/uploads/sample.png' 
            });
        }

        await Product.insertMany(sampleProducts);
        console.log('20 Fake Products successfully seeded into MongoDB!');
        process.exit(0);
    } catch (error) {
        console.error('Error importing data:', error.message);
        process.exit(1);
    }
};


const destroyData = async () => {
    await connectDB();
    try {
        await Product.deleteMany();
        await Review.deleteMany();
        await User.deleteMany();
        console.log('All data destroyed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error destroying data:', error.message);
        process.exit(1);
    }
};


if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
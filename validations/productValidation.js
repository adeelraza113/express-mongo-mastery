import Joi from 'joi';


export const productCreateSchema = Joi.object({
    name: Joi.string().trim().min(3).max(100).required().messages({
        'string.empty': 'Product name cannot be empty',
        'string.min': 'Product name should have at least 3 characters'
    }),
    price: Joi.number().positive().required().messages({
        'number.positive': 'Price must be a positive number'
    }),
    description: Joi.string().trim().optional(),
    category: Joi.string().trim().required(),
    stock: Joi.number().integer().min(0).default(0)
});


export const userRegisterSchema = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address'
    }),
    password: Joi.string().min(6).required()
});
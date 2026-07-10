import { AppError } from './errorHandler.js';

export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, allowUnknown: true });

        if (error) {
            const errorMessages = {};
            error.details.forEach(detail => {
                errorMessages[detail.path[0]] = detail.message.replace(/"/g, '');
            });
            return res.status(400).json({
                status: 'fail',
                errors: errorMessages
            });
        }
        req.body = value;
        next();
    };
};
export const validateProductInput = (data) => {
    const errors = {};

    if (!data.name || data.name.trim() === "") {
        errors.name = "Product name is required";
    }
    
    if (data.price === undefined || data.price === null) {
        errors.price = "Product price is required";
    } else if (isNaN(data.price) || Number(data.price) < 0) {
        errors.price = "Price must be a valid positive number";
    }

    if (!data.category || data.category.trim() === "") {
        errors.category = "Product category is required";
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};
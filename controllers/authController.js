import authService from '../services/authService.js';

class AuthController {
    async signup(req, res, next) {
        try {
            const result = await authService.register(req.body);
            return res.status(201).json({ status: "success", ...result });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            return res.status(200).json({ status: "success", ...result });
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
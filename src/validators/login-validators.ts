import { checkSchema } from 'express-validator';

export default checkSchema({
    email: {
        errorMessage: 'email is required',
        notEmpty: true,
        trim: true,
        isEmail: {
            errorMessage: 'email is not a valid email',
        },
    },
    password: {
        errorMessage: 'password cannot be empty',
        notEmpty: true,
        trim: true,
    },
});

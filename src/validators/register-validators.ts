import { checkSchema } from 'express-validator';

export default checkSchema({
    email: {
        errorMessage: 'email is required',
        notEmpty: true,
    },
});
// export default [body('email').notEmpty()];

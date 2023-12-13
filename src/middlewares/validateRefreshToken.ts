import { expressjwt } from 'express-jwt';
import { Config } from '../config';
import { AuthCookie, IRefreshTokenPayload } from '../types';
import { AppDataSource } from '../config/data-source';
import { RefreshToken } from '../entity/RefreshToken';
import logger from '../config/logger';

export default expressjwt({
    secret: Config.REFRESH_TOKEN_SECRET!,
    algorithms: ['HS256'],
    getToken(req) {
        const { refreshToken } = req.cookies as AuthCookie;
        return refreshToken;
    },

    async isRevoked(request, token) {
        try {
            const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
            const refreshToken = refreshTokenRepo.findOne({
                where: {
                    id: Number((token?.payload as IRefreshTokenPayload).id),
                    user: { id: Number(token?.payload.sub) },
                },
            });
            return refreshToken === null;
        } catch (error) {
            logger.error('error while getting refresh token', {
                id: (token?.payload as IRefreshTokenPayload).id,
            });
        }
        return true;
    },
});

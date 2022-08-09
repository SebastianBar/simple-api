import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';

type TokenContents = {
  id: string;
}

const prisma = new PrismaClient();

const verify = async (payload: TokenContents, callback: CallableFunction): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    callback(null, user);
  } catch (error) {
    callback(error);
  }
};

const statOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SIGNATURE_KEY || '123',
};

const strategy = new Strategy(statOptions, verify);

export default strategy;

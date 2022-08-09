import Passport from 'passport';
import jwtStrategy from './jwtStrategy.js';

const passport = Passport.use(jwtStrategy);

export default passport;

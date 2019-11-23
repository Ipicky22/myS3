import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { getRepository } from 'typeorm';
import { User }  from "../../database/entity/User";

require ('dotenv').config();

passport.use(
  new LocalStrategy(
    {
      emailField: "email",
      password: "password"
    },
    async (email, password, next) => {
      const user = await getRepository(User).findOne({ where: {email} });

      if (!user) {
        return next("Email doesn't exist");
      }
      return next(false, user);
    }
  )
);


passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SUPERSECRET
    },
    async (jwtPayload, next) => {
      try {
         const user = await getRepository(User).findOne({ where: {email: jwtPayload.email} });

         if (!user){
           return next("User doesn't exist");
         }

         return next(false, user);
      }catch (err) {
        return next(err.message);
      }
    }
  )
);
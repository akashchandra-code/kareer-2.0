import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import userModel, { IUser } from "../models/user.model";
import { generateToken } from "../utlis/jwt";
import { env } from "./env";
import { Request } from "express";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/users/google/callback",
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done
    ) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Email not found"), false);
        }

        let user: IUser | null = await userModel.findOne({ email });

        // ✅ Create user if not exists
        if (!user) {
          user = await userModel.create({
            name: profile.displayName,
            email,
            avatar: profile.photos?.[0]?.value,
            role: "user",
            provider: "google",
            isVerified: true, // Google emails are verified
          });
        }

        // ❌ Blocked user check (important)
        if (user.isBlocked) {
          return done(new Error("User is blocked"), false);
        }
        if (user.provider !== "google") {
          return done(new Error("Please login using your registered method"), false);
        }

        // ✅ JWT (same as your normal login)
        const token = generateToken({
          userId: user._id.toString(),
          role: user.role,
          provider: user.provider,
        });

        return done(null, { token });
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export default passport;

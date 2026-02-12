import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import companyModel, { ICompany } from "../models/company.model";
import { generateToken } from "../utils/jwt";
import { env } from "./env";
import { Request } from "express";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/api/company/google/callback",
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

        let company: ICompany | null = await companyModel.findOne({ email });

        // ✅ Create user if not exists
        if (!company) {
          company = await companyModel.create({
            name: profile.displayName,
            email,
            logo: profile.photos?.[0]?.value,
            role: "company",
            provider: "google",
            isVerified: true, // Google emails are verified
          });
        }

        // ❌ Blocked user check (important)
        if (company.isBlocked) {
          return done(new Error("company is blocked"), false);
        }
        if (company.provider !== "google") {
          return done(new Error("Please login using your registered method"), false);
        }

        // ✅ JWT (same as your normal login)
        const token = generateToken({
          companyId: company._id.toString(),
          role: company.role,
          provider: company.provider,
        });

        return done(null, { token });
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export default passport;

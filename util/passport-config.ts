// import { Strategy as LocalStrategy } from "passport-local";
// import User from "../models/user";
// import dotenv from "dotenv";
// import bcrypt from "bcrypt";
// dotenv.config();

// const localStrategy = new LocalStrategy(
//   { usernameField: "email" },
//   async (email, password, done) => {
//     try {
//       const user = await User.findOne({ where: { email: email } });
//       if (user == null)
//         return done(null, false, { message: "No user with that email" });
//       const userPassword = user.hashedPassword;
//       if (!userPassword || (await bcrypt.compare(password, userPassword))) {
//         return done(null, false, { message: "password incorrect" });
//       } else {
//         return done(null, user);
//       }
//     } catch (err) {
//       return done(err);
//     }
//   }
// );

// export default localStrategy;

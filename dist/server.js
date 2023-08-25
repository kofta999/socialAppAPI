"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./util/db"));
const posts_1 = __importDefault(require("./routes/posts"));
const comments_1 = __importDefault(require("./routes/comments"));
const relations_1 = __importDefault(require("./util/relations"));
const user_1 = __importDefault(require("./models/user"));
// import session from "express-session";
// import passport from "passport";
// import dotenv from "dotenv";
// import authRouter from "./routes/auth"
// dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "secret",
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());
app.use((req, res, next) => {
    user_1.default.findByPk(1)
        .then((user) => {
        res.locals.user = user;
        next();
    })
        .catch((err) => console.log(err));
});
app.use("/posts", posts_1.default);
app.use("/comments", comments_1.default);
// app.use("/", authRouter)
(0, relations_1.default)();
db_1.default
    .sync()
    .then(() => {
    return user_1.default.findByPk(1);
})
    .then((user) => {
    if (!user) {
        return user_1.default.create({
            fullName: "admin",
            email: "admin@admin.com",
            hashedPassword: "admin",
        });
    }
    return user;
})
    .then(() => app.listen(3000, () => console.log("Connected on port 3000")))
    .catch((err) => console.log(err));

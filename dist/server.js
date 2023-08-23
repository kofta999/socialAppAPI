"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./util/db"));
const posts_1 = __importDefault(require("./routes/posts"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/posts", posts_1.default);
db_1.default
    .sync()
    .then(() => app.listen(3000, () => console.log("Connected on port 3000")))
    .catch((err) => console.log(err));

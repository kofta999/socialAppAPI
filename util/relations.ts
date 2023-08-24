import User from "../models/user";
import Post from "../models/post";

export default () => {
    User.hasMany(Post);
    Post.belongsTo(User, { constraints: true, onDelete: "CASCADE" })
}
import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";

export default () => {
  User.hasMany(Post);
  User.hasMany(Comment);
  Post.hasMany(Comment);
  Post.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
  Comment.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
  Comment.belongsTo(Post, { constraints: true, onDelete: "CASCADE" });
};

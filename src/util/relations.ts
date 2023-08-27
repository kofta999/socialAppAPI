import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";
import Like from "../models/like";

export default () => {
  // User Relations
  User.hasMany(Post);
  User.hasMany(Comment);
  User.hasMany(Like);
  
  //  Post Relations
  Post.hasMany(Comment);
  Post.hasMany(Like, {
    foreignKey: "likableId",
    constraints: false,
    scope: {
      likableType: "post",
    },
  });
  Post.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

  // Comment Relations
  Comment.hasMany(Like, {
    foreignKey: "likableId",
    constraints: false,
    scope: {
      likableType: "comment",
    },
  });
  Comment.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
  Comment.belongsTo(Post, { constraints: true, onDelete: "CASCADE" });

  // Like Relations
  Like.belongsTo(Post, { constraints: false, foreignKey: "likableId" });
  Like.belongsTo(Comment, { constraints: false, foreignKey: "likableId" });
  Like.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
};

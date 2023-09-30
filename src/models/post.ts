import {
  DataTypes,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  Model,
} from "sequelize";
import sequelize from "../util/db";
import Like from "./like";
import User from "./user";
import Comment from "./comment";

class Post extends Model {
  declare id: number;
  declare content: string;
  declare userId: number;
  declare getComments: HasManyGetAssociationsMixin<Comment>;
  declare createLike: HasManyCreateAssociationMixin<Like>;
  declare countLikes: HasManyCountAssociationsMixin;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "post",
  }
);

Post.addScope("withLikesAndComments", (userId) => {
  return {
    attributes: {
      include: [
        [
          sequelize.literal('(SELECT COUNT(*) FROM comments WHERE comments.postId = post.id)'),
          'commentCount'
        ],
        [
          sequelize.literal(`(SELECT COUNT(*) FROM likes WHERE likes.likableId = post.id AND likes.likableType = 'post')`),
          'likesCount'
        ],
        [
          sequelize.literal(`EXISTS (SELECT 1 FROM likes WHERE likes.likableId = post.id AND likes.likableType = 'post' AND likes.userId = ${userId})`),
          'likedByUser'
        ]
      ],
      exclude: ["userId"],
    },
    include: [
      { model: User, attributes: ["id", "fullName"] },
    ],
    group: ["post.id", "user.id"],
    order: [["createdAt", "DESC"]],
  };
});

export default Post;

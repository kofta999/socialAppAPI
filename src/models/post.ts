import {
  DataTypes,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  Model,
} from "sequelize";
import sequelize from "../util/db";
import Like from "./like";

class Post extends Model {
  declare id: number;
  declare content: string;
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

export default Post;

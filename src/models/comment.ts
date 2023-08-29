import {
  DataTypes,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Model,
} from "sequelize";
import sequelize from "../util/db";
import Like from "./like";

class Comment extends Model {
  declare id: number;
  declare content: string;
  declare userId: number;
  declare createLike: HasManyCreateAssociationMixin<Like>;
  declare countLikes: HasManyCountAssociationsMixin;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: "comment" }
);

export default Comment;

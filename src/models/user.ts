import { DataTypes, HasManyCreateAssociationMixin, Model } from "sequelize";
import sequelize from "../util/db";
import Post from "./post";
import Comment from "./comment";

class User extends Model {
  declare id: number;
  declare fullName: string;
  declare email: string;
  declare hashedPassword: string;
  declare createPost: HasManyCreateAssociationMixin<Post>;
  declare createComment: HasManyCreateAssociationMixin<Comment>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: "user" }
);

export default User;

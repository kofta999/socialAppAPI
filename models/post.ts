import { DataTypes, Model } from "sequelize";
import sequelize from "../util/db";

class Post extends Model {
  declare id: number;
  declare content: string;
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

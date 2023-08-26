import { DataTypes, Model } from "sequelize";
import sequelize from "../util/db";

class Like extends Model {
  declare id: number;
  declare likableType: string;
  declare likableId: number;
  declare userId: number;
}

Like.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    likableType: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "user_like",
    },
    likableId: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      unique: "user_like",
    },
    userId: {
      type: DataTypes.INTEGER,
      unique: "user_like",
    },
  },
  {
    sequelize,
    modelName: "like",
  }
);

export default Like;

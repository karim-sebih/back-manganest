import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Likes = sequelize.define(
  "Likes",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    mangadex_chapter_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "likes",
    timestamps: false,
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "mangadex_chapter_id"],
      },
    ],
  }
);

export default Likes;
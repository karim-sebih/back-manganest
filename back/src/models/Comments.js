import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Comments = sequelize.define(
  "Comments",
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

    mangadex_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    mangadex_chapter_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "comments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    freezeTableName: true,
  }
);

export default Comments;
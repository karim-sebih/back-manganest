import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Progress = sequelize.define(
  "Progress",
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
      allowNull: false,
    },

    page: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    tableName: "progress",
    timestamps: true,
    createdAt: false,
    updatedAt: "updated_at",
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "mangadex_id"],
      },
    ],
  }
);

export default Progress;
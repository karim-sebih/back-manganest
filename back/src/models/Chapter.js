import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Chapter = sequelize.define(
    "Chapter",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        manga_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        chapter_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    },
    {
        tableName: "chapters",
        timestamps: false,
    }
);

export default Chapter;

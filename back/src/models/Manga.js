import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Manga = sequelize.define(
    "Manga",
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

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        cover: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        status: {
            type: DataTypes.ENUM( "pending", "approved", "rejected"),
            defaultValue: "pending"
        }

    },
    {
        tableName: "manga",
        timestamps: false,
    }
);

export default Manga;

import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Page = sequelize.define(
    "Page",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        chapter_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        image_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        page_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        tableName: "pages",
        timestamps: false,
    }
);

export default Page;

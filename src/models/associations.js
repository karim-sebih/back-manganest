import User from "./User.js";
import Library from "./Library.js";
import Ratings from "./Ratings.js";
import Comments from "./Comments.js";
import Progress from "./Progress.js";
import Likes from "./Likes.js";
import Manga from "./Manga.js";
import Chapter from "./Chapter.js";
import Page from "./Page.js"

export function setupassociations() {

    User.hasMany(Library, { foreignKey: "user_id", onDelete: "CASCADE" });
    Library.belongsTo(User, { foreignKey: "user_id" });

    User.hasMany(Ratings, { foreignKey: "user_id", onDelete: "CASCADE" });
    Ratings.belongsTo(User, { foreignKey: "user_id" });

    User.hasMany(Comments, { foreignKey: "user_id", onDelete: "CASCADE" });
    Comments.belongsTo(User, { foreignKey: "user_id" });

    User.hasMany(Progress, { foreignKey: "user_id", onDelete: "CASCADE" });
    Progress.belongsTo(User, { foreignKey: "user_id" });

    User.hasMany(Likes, { foreignKey: "user_id", onDelete: "CASCADE" });
    Likes.belongsTo(User, { foreignKey: "user_id" });

    User.hasMany(Manga, { foreignKey: "user_id", onDelete: "CASCADE" });
    Manga.belongsTo(User, { foreignKey: "user_id" });

    Manga.hasMany(Chapter, { foreignKey: "manga_id", onDelete: "CASCADE" });
    Chapter.belongsTo(Manga, { foreignKey: "manga_id" });

    Chapter.hasMany(Page, { foreignKey: "chapter_id", onDelete: "CASCADE" });
    Page.belongsTo(Chapter, { foreignKey: "chapter_id" });
}
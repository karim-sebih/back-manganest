import User from "../models/User.js";
import Likes from "../models/Likes.js";

async function getLikesByChapter(req, res) {
    try {
        const likes = await Likes.findAll({
            where: {
                mangadex_chapter_id: req.params.id,
            },
            include: [
                {
                    model: User,
                    as: "User",
                    attributes: ["id", "username"],
                },
            ],
        });
        res.json(likes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function addLike(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const like = await Likes.create({
            user_id: req.user.id,
            mangadex_chapter_id: req.params.id,
        });

        res.json({ success: true, like });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


async function removeLike(req, res) {
    try {
        const like = await Likes.findOne({
            where: {
                user_id: req.user.id,
                mangadex_chapter_id: req.params.id,
            },
        });
        if (like) {
            await like.destroy();
            res.json({ success: true });
        } else {
            res.status(404).json({ error: "Like not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export { getLikesByChapter, addLike, removeLike };
import Comments from "../models/Comments.js";
import User from "../models/User.js";

async function createComment(req, res) {
    try {
        const { content, mangadex_id, mangadex_chapter_id } = req.body;
        const comment = await Comments.create({
            content,
            mangadex_id,
            mangadex_chapter_id: mangadex_chapter_id || null,
            user_id: req.user.id,
        });

        res.json({ success: true, comment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

async function getCommentsByManga(req, res) {
    try {
        const comments = await Comments.findAll({
            where: {
                mangadex_id: req.params.id,
                mangadex_chapter_id: null,
            },
            include: [
                {
                    model: User,
                    as: "User",
                    attributes: ["id", "username"],
                },
            ],
            order: [["created_at", "DESC"]],
        });

        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

async function getCommentsByChapter(req, res) {
    try {
        const comments = await Comments.findAll({
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
            order: [["created_at", "DESC"]],
        });

        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

async function deleteComment(req, res) {
    try {
        const comment = await Comments.findByPk(req.params.id);

        if (!comment) {
            return res.status(404).json({ error: "Not found" });
        }

        if (comment.user_id !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await comment.destroy();

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

async function updateComment(req, res) {
    try {
        const { content } = req.body;

        const comment = await Comments.findByPk(req.params.id);

        if (!comment) {
            return res.status(404).json({ error: "Not found" });
        }

        if (comment.user_id !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        comment.content = content;
        await comment.save();

        res.json({ success: true, comment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

export {
    createComment,
    getCommentsByManga,
    getCommentsByChapter,
    deleteComment,
    updateComment,
};

import Ratings from "../models/Ratings.js";
import User from "../models/User.js";

async function createOrUpdateRating(req, res) {
    try {
        const { mangaId, rating } = req.body;
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        let userRating = await Ratings.findOne({
            where: {
                user_id: req.user.id,
                mangadex_id: mangaId,
            },
        });
        if (userRating) {
            userRating.rating = rating;
            await userRating.save();
        } else {
            userRating = await Ratings.create({
                user_id: req.user.id,
                mangadex_id: mangaId,
                rating,
            });
        }
        res.json({ success: true, rating: userRating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getRatingsByManga(req, res) {
    try {
        const ratings = await Ratings.findAll({
            where: {
                mangadex_id: req.params.id,
            },
        });

        const avg =
            ratings.length > 0
                ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
                : 0;

        const userRating = req.user
            ? ratings.find(r => r.user_id === req.user.id)
            : null;

        res.json({
            average: avg,
            count: ratings.length,
            userRating: userRating?.rating || null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


async function deleteRating(req, res) {
    try {
        const rating = await Ratings.findOne({
            where: {
                user_id: req.user.id,
                mangadex_id: req.params.id,
            },
        });
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (rating) {
            await rating.destroy();
            res.json({ success: true });
        } else {
            res.status(404).json({ error: "Rating not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export { createOrUpdateRating, getRatingsByManga, deleteRating };
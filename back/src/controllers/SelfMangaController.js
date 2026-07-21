import Manga from "../models/Manga.js"
import User from "../models/User.js"
import Chapter from "../models/Chapter.js";

async function CreateManga(req, res) {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);
        console.log("USER:", req.user);

        const { title, description } = req.body;
        const user_id = req.user.id;

        let coverUrl = null;

        if (req.file) {
            coverUrl = `/uploads/${req.file.filename}`;
        }

        const manga = await Manga.create({
            title,
            description,
            user_id,
            cover: coverUrl,
        });

        res.json(manga);
    } catch (err) {
        console.error("CREATE MANGA ERROR:", err);
        res.status(500).json({ message: err.message });
    }
}


async function GetAllSelfManga(req, res) {
    try {
        const mangas = await Manga.findAll({
            order: [["created_at", "DESC"]]
        });

        res.json(mangas);
    } catch (error) {
        res.status(500).json({ message: "Erreur fetch tous les mangas" });
    }
}


async function GetUsersSelfManga(req, res) {
    try {
        const user_id = req.user.id;

        const manga = await Manga.findAll({
            where: { user_id },
            order: [["created_at", "DESC"]]
        });

        res.json(manga);
    } catch (error) {
        res.status(500).json({ message: "Erreur l'hors du fetch des self manga" })
    }
}

async function UpdateSelfManga(req, res) {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        await Manga.update(
            { title, description },
            { where: { id, user_id: req.user.id } }
        );

        res.json({ message: "Update SelfManga réussi" })
    } catch (error) {
        res.status(500).json({ message: "erreur l'hors de l'updating du selfmanga" })
    }
}


async function DeleteSelfManga(req, res) {
    try {
        const { id } = req.params;

        await Manga.destroy({ where: { id, user_id: req.user.id } });

        res.json({ message: "Manga supprimé" })
    } catch (error) {
        res.status(500).json({ message: "erreur l'hors de la suppression du selfmanga" })
    }
}

async function GetSelfMangaById(req, res) {
    try {
        const { id } = req.params;

        const manga = await Manga.findByPk(id);

        if (!manga) {
            return res.status(404).json({ message: "Manga not found" });
        }

        const chapters = await Chapter.findAll({
            where: { manga_id: id },
            order: [["chapter_number", "ASC"]]
        });

        res.json({ manga, chapters });
    } catch (err) {
        res.status(500).json({ message: "Erreur fetch manga" });
    }
}


async function SubmitManga(req, res) {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const manga = await Manga.findByPk(id);

        if (!manga) {
            return res.status(404).json({ message: "Manga introuvable" });
        }

        if (manga.user_id !== user_id) {
            return res.status(403).json({ message: "Non autorisé" });
        }

        // check au moins 1 chapitre
        const chapterCount = await Chapter.count({
            where: { manga_id: id }
        });

        if (chapterCount === 0) {
            return res.status(400).json({
                message: "Ajoute au moins un chapitre avant de soumettre"
            });
        }

        await manga.update({
            status: "pending",
            is_submitted: true
        });
        if (manga.is_submitted) {
            return res.status(400).json({
                message: "Manga déjà soumis"
            });
        }

        res.json({ message: "Manga soumis pour validation" });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la soumission" });
    }
}

export { CreateManga, GetUsersSelfManga, UpdateSelfManga, DeleteSelfManga, GetSelfMangaById, SubmitManga, GetAllSelfManga };
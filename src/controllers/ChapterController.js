import Chapter from "../models/Chapter.js";
import Manga from "../models/Manga.js";
import Page from "../models/Page.js";

async function CreateChapter(req, res) {
    try {
        const { manga_id, title, chapter_number } = req.body;

        const manga = await Manga.findByPk(manga_id);

        if (!manga) {
            return res.status(404).json({ message: "Manga not found" });
        }

        if (manga.user_id !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const chapter = await Chapter.create({
            title,
            chapter_number,
            manga_id
        });

        res.json(chapter);
    } catch (error) {
        res.status(500).json({ message: "Error creating chapter" });
    }
}


async function GetChaptersByManga(req, res) {
    try {
        const { manga_id } = req.params;

        const chapters = await Chapter.findAll({
            where: { manga_id },
            order: [["chapter_number", "ASC"]]
        });

        res.json(chapters);
    } catch {
        res.status(500).json({ message: "Error fetch chapters" });
    }
}

async function GetChapterById(req, res) {
    try {
        const { id } = req.params;

        const chapter = await Chapter.findByPk(id, {
            include: [
                {
                    model: Page,
                    attributes: ["id", "image_url", "page_number"],
                    order: [["page_number", "ASC"]]
                }
            ]
        });

        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        res.json(chapter);
    } catch (error) {
        res.status(500).json({ message: "error fetching chapter" });
    }
}

async function UpdateChapter(req, res) {
    try {
        const { id } = req.params;
        const { title, chapter_number } = req.body;

        const chapter = await Chapter.findByPk(id);
        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        const manga = await Manga.findByPk(chapter.manga_id);

        if (manga.user_id !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await Chapter.update(
            { title, chapter_number },
            { where: { id } }
        );

        res.json({ message: "Chapter updated" });
    } catch {
        res.status(500).json({ message: "Erreur update chapitre" });
    }
}


async function DeleteChapter(req, res) {
    try {
        const { id } = req.params;

        const chapter = await Chapter.findByPk(id);
        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        const manga = await Manga.findByPk(chapter.manga_id);

        if (manga.user_id !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await Chapter.destroy({ where: { id } });

        res.json({ message: "Chapter deleted" });
    } catch {
        res.status(500).json({ message: "Erreur suppression chapitre" });
    }
}


export {
    CreateChapter,
    GetChaptersByManga,
    GetChapterById,
    UpdateChapter,
    DeleteChapter
};

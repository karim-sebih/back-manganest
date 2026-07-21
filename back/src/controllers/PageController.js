import Page from "../models/Page.js"
import Chapter from "../models/Chapter.js"
import upload from "../middlewares/upload.js";
import Manga from "../models/Manga.js";



async function CreatePages(req, res) {
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

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const pages = req.files.map((page, index) => ({
            chapter_id: id,
            image_url: `/uploads/${page.filename}`,
            page_number: index + 1
        }));



        await Page.bulkCreate(pages);

        res.json({ message: "Pages uploadées" });
    } catch (error) {
        res.status(500).json({ message: "Erreur création page" });
    }
}


async function GetPagesByChapter(req, res) {
    try {
        const { chapter_id } = req.params;

        const pages = await Page.findAll({
            where: { chapter_id },
            order: [["page_number", "ASC"]],
        });

        res.json(pages);
    } catch {
        res.status(500).json({ message: "Erreur fetch pages" });
    }
}


async function UpdatePage(req, res) {
    try {
        const { id } = req.params;
        const { page_number } = req.body;

        const page = await Page.findByPk(id);
        if (!page) {
            return res.status(404).json({ message: "Page not found" });
        }

        const chapter = await Chapter.findByPk(page.chapter_id);
        const manga = await Manga.findByPk(chapter.manga_id);

        if (manga.user_id !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }


        await Page.update(
            { page_number },
            { where: { id } }
        );

        res.json({ message: "Page mise à jour" });
    } catch {
        res.status(500).json({ message: "Erreur update page" });
    }
}


async function DeletePage(req, res) {
    try {
        const { id } = req.params;

        const page = await Page.findByPk(id);
        if (!page) return res.status(404).json({ message: "Page not found" });

        const chapter = await Chapter.findByPk(page.chapter_id);
        const manga = await Manga.findByPk(chapter.manga_id);

        if (manga.user_id !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }


        await Page.destroy({ where: { id } });

        res.json({ message: "Suppression réussie" });
    } catch (error) {
        res.status(500).json({ message: "Erreur suppression page" });
    }
}


export { CreatePages, GetPagesByChapter, UpdatePage, DeletePage }
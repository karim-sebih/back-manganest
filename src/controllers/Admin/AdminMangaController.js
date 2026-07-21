import Manga from "../../models/Manga.js";

async function GetPendingManga(req, res) {
    try {
        const mangas = await Manga.findAll({
            where: { status: "pending" },
            order: [["created_at", "DESC"]]
        });

        res.json(mangas);
    } catch (err) {
        res.status(500).json({ message: "Erreur fetch pending manga" });
    }
}

async function GetApprovedManga(req, res) {
    try {
        const mangas = await Manga.findAll({
            where: { status: "APPROVED" }
        });

        res.json(mangas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching approved manga" });
    }
};

async function ApproveManga(req, res) {
    try {
        const { id } = req.params;

        const manga = await Manga.findByPk(id);

        if (!manga) {
            return res.status(404).json({ message: "Not found" });
        }

        await manga.update({ status: "approved" });

        res.json({ message: "Manga approuvé " });
    } catch (err) {
        res.status(500).json({ message: "Erreur approve" });
    }
}

async function RejectManga(req, res) {
    try {
        const { id } = req.params;

        const manga = await Manga.findByPk(id);

        if (!manga) {
            return res.status(404).json({ message: "Not found" });
        }

        await manga.update({ status: "rejected" });

        res.json({ message: "Manga rejeté " });
    } catch (err) {
        res.status(500).json({ message: "Erreur reject" });
    }
}

async function DeleteManga(req, res) {
    try {
        const { id } = req.params;

        const manga = await Manga.findByPk(id);

        if (!manga) {
            return res.status(404).json({ message: "Not found" });
        }

        await manga.destroy();

        res.json({ message: "Manga supprimé " });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur delete manga" });
    }
}

export { GetPendingManga, ApproveManga, RejectManga, GetApprovedManga, DeleteManga };
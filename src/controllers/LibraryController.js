import User from '../models/User.js';
import Library from '../models/Library.js';
import mangadexService from "../services/mangadex.service.js";



async function addOrUpdateEntry(req, res) {
    try {
        const user_id = req.user.id;
        const { mangadex_id, status } = req.body;

        await Library.upsert({
            user_id,
            mangadex_id,
            status
        });

        const entry = await Library.findOne({
            where: { user_id, mangadex_id }
        });

        res.json({ entry });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error saving library entry' });
    }
}

async function deleteEntry(req, res) {
    try {
        const user_id = req.user.id;
        const { mangadex_id } = req.params;

        const deleted = await Library.destroy({
            where: { user_id, mangadex_id }
        });

        if (!deleted) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting entry' });
    }
}

async function getUserLibrary(req, res) {
    try {
        const user_id = req.user.id; // ou mock si pas d'auth

        const library = await Library.findAll({
            where: { user_id }
        });

        if (!library.length) {
            return res.json([]);
        }

        const ids = library.map(item => item.mangadex_id);

        const mangas = await mangadexService.getMangasByIds(ids);

        const mangaMap = new Map(mangas.map(m => [m.id, m]));

        const result = library.map(item => {
            const manga = mangaMap.get(item.mangadex_id);

            const title = manga?.attributes?.title
                ? Object.values(manga.attributes.title)[0]
                : "Titre inconnu";

            const coverRel = manga?.relationships?.find(r => r.type === "cover_art");

            const cover = coverRel?.attributes?.fileName
                ? `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}`
                : null;

            return {
                id: item.id,
                mangadex_id: item.mangadex_id,
                status: item.status,
                title,
                cover
            };
        });


        res.json(result);

    } catch (error) {
        console.error("getUserLibrary Error:", error.message);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function getLibraryWithLatestChapter(req, res) {
    try {
        const user_id = req.user.id;

        const library = await Library.findAll({
            where: { user_id },
            limit: 10
        });

        if (!library.length) {
            return res.json([]);
        }

        const mangas = await mangadexService.getMangasByIds(
            library.map(item => item.mangadex_id)
        );

        const mangaMap = new Map(mangas.map(m => [m.id, m]));

        const results = await Promise.all(
            library.map(async (item) => {
                const id = item.mangadex_id;

                try {
                    const chapters = await mangadexService.getMangaChapters(id, ["fr", "en"]);

                    const latest = chapters
                        ?.sort((a, b) => {
                            const dateA = a.attributes.readableAt
                            new Date(a.attributes.readableAt)

                            const dateB = b.attributes.readableAt
                            new Date(b.attributes.readableAt)

                            return dateB - dateA;
                        })?.[0];

                    const manga = mangaMap.get(id);

                    const title = manga?.attributes?.title
                        ? Object.values(manga.attributes.title)[0]
                        : "Titre inconnu";

                    const coverRel = manga?.relationships?.find(r => r.type === "cover_art");

                    const cover = coverRel?.attributes?.fileName
                        ? `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}`
                        : null;

                    return {
                        mangadex_id: id,
                        title,
                        cover,
                        lastChapter: latest?.attributes?.chapter || "??",
                        chapterId: latest?.id || null,
                        readableAt: latest?.attributes?.readableAt || null
                    };

                } catch (e) {
                    console.error("chapters error for", id, e.message);
                    return null;
                }
            })
        );

        const filtered = results
            .filter(Boolean)
            .sort((a, b) => {
                const dateA = a.readableAt ? new Date(a.readableAt) : 0;
                const dateB = b.readableAt ? new Date(b.readableAt) : 0;
                return dateB - dateA;
            });

        res.json(filtered);

    } catch (error) {
        console.error("getLibraryWithLatestChapter:", error);
        res.status(500).json({ error: "Error" });
    }
}



export { addOrUpdateEntry, deleteEntry, getUserLibrary, getLibraryWithLatestChapter };
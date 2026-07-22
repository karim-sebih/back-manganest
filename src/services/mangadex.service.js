import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "https://api.mangadex.org";

const mangadexService = {

    // Recherche manga
    searchManga: async (title = "", limit = 150, offset = 0, includedTags = [], excludedTags = []) => {
        try {
            const params = new URLSearchParams();
            params.append("title", title); // Supprimez encodeURIComponent ici
            params.append("limit", limit);
            params.append("offset", offset);
            params.append("includes[]", "cover_art");
            params.append("availableTranslatedLanguage[]", "fr");
            params.append("availableTranslatedLanguage[]", "en");

            includedTags.forEach(tag => params.append("includedTags[]", tag));
            excludedTags.forEach(tag => params.append("excludedTags[]", tag));

            const res = await fetch(`${BASE_URL}/manga?${params}`);
            const data = await res.json();
            return data.data || [];
        } catch (error) {
            console.error("searchManga Error:", error.message);
            throw error;
        }
    },
    // Un Manga par ID
    getMangaById: async (id) => {
        try {

            const res = await fetch(
                `${BASE_URL}/manga/${id}?includes[]=author&includes[]=artist&includes[]=cover_art`
            );

            const data = await res.json();

            return data.data;

        } catch (error) {
            console.error("getMangaById Error:", error.message);
            throw error;
        }
    },

    // plusieurs mangas par ID
    getMangasByIds: async (ids) => {
        try {
            const params = new URLSearchParams();

            ids.forEach(id => params.append("ids[]", id));
            params.append("includes[]", "cover_art");

            const res = await fetch(`${BASE_URL}/manga?${params}`);
            const data = await res.json();

            return data.data || [];
        } catch (error) {
            console.error("getMangasByIds Error:", error.message);
            throw error;
        }
    },

    /* Récupérer les chapitres d’un manga (sois en eng sois en fr pour l'instant*/
    getMangaChapters: async (
        id,
        languages = ["fr"]
    ) => {

        try {

            const languageQuery = languages
                .map(
                    (lang) =>
                        `translatedLanguage[]=${lang}`
                )
                .join("&");

            const res = await fetch(
                `${BASE_URL}/chapter?manga=${id}&${languageQuery}&order[chapter]=desc&limit=100`
            );

            const data = await res.json();

            return data.data;

        } catch (error) {

            console.error(
                "getMangaChapters Error:",
                error.message
            );

            throw error;
        }
    },

    getChapterPages: async (id) => {
        try {

            const res = await fetch(
                `${BASE_URL}/at-home/server/${id}`
            );

            const data = await res.json();

            return data;

        } catch (error) {

            console.error(
                "getChapterPages Error:",
                error.message
            );

            throw error;
        }
    },

    // Tous les mangas récents
    getAllManga: async (
        limit = 20,
        offset = 0,
        contentFilters = ["safe", "suggestive"],
        includedTags = [],
        excludedTags = []
    ) => {
        try {
            const params = new URLSearchParams({
                limit,
                offset,
                "order[latestUploadedChapter]": "desc",
            });

            contentFilters.forEach(f => params.append("contentRating[]", f));
            includedTags.forEach(t => params.append("includedTags[]", t));
            excludedTags.forEach(t => params.append("excludedTags[]", t));

            params.append("includes[]", "cover_art");
            params.append("availableTranslatedLanguage[]", "fr");
            params.append("availableTranslatedLanguage[]", "en");

            const res = await fetch(`${BASE_URL}/manga?${params}`);

            if (!res.ok) throw new Error(`MangaDex API Error: ${res.status}`);

            const data = await res.json();
            return data.data || [];

        } catch (error) {
            console.error("getAllManga:", error);
            throw error;
        }
    },


    // Derniers chapitres
    getLatestChapters: async (
        limit = 12,
        offset = 0,
        language,
        contentFilters = ["safe", "suggestive"],
        includedTags = [],
        excludedTags = []
    ) => {
        const FETCH_SIZE = limit * 4;
        const adjustedOffset = offset * 4;

        const params = new URLSearchParams({
            limit: FETCH_SIZE,
            offset: adjustedOffset,
            "order[latestUploadedChapter]": "desc",
        });

        contentFilters.forEach(f => params.append("contentRating[]", f));
        includedTags.forEach(t => params.append("includedTags[]", t));
        excludedTags.forEach(t => params.append("excludedTags[]", t));

        params.append("includes[]", "cover_art");
        params.append("availableTranslatedLanguage[]", "fr");
        params.append("availableTranslatedLanguage[]", "en");

        const mangaRes = await fetch(`${BASE_URL}/manga?${params}`);
        if (!mangaRes.ok) throw new Error("Manga error");

        const mangas = (await mangaRes.json()).data || [];
        if (!mangas.length) return [];

        const mangaMap = new Map(mangas.map(m => [m.id, m]));


        const results = await Promise.all(
            mangas.map(async (m) => {
                try {
                    const res = await fetch(
                        `${BASE_URL}/chapter?manga=${m.id}&translatedLanguage[]=${language}&order[readableAt]=desc&limit=3`
                    );
                    if (!res.ok) return [];
                    return (await res.json()).data || [];
                } catch {
                    return [];
                }
            })
        );

        let chapters = results.flat();

        //  tri
        chapters.sort(
            (a, b) =>
                new Date(b.attributes.readableAt) - new Date(a.attributes.readableAt)
        );

        //  unique manga
        const seen = new Set();
        chapters = chapters.filter(ch => {
            const id = ch.relationships.find(r => r.type === "manga")?.id;
            if (!id || seen.has(id)) return false;
            seen.add(id);
            return true;
        });

        //  limite
        chapters = chapters.slice(0, limit);

        //  format final
        return chapters.map(ch => {
            const mangaId = ch.relationships.find(r => r.type === "manga")?.id;
            const manga = mangaMap.get(mangaId);

            const coverRel = manga?.relationships?.find(r => r.type === "cover_art");

            return {
                id: mangaId,
                chapterId: ch.id,
                mangaTitle: manga?.attributes?.title
                    ? Object.values(manga.attributes.title)[0]
                    : "Titre inconnu",
                lastChapter: ch.attributes.chapter || "??",
                publishAt: ch.attributes.readableAt,
                cover: coverRel?.attributes?.fileName
                    ? `https://uploads.mangadex.org/covers/${mangaId}/${coverRel.attributes.fileName}`
                    : null,
            };
        });
    },




};

export default mangadexService;
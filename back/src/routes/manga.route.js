import express from 'express';

import {
    searchManga,
    getMangaById,
    getAllManga,
    getLatestChapters,

    getChapterPages
} from '../controllers/MangaController.js';

const Mangarouter = express.Router();

Mangarouter.get('/search', searchManga);

Mangarouter.get('/all-mangas', getAllManga);

Mangarouter.get('/latest-chapters', getLatestChapters);



Mangarouter.get('/chapter/:id/pages', getChapterPages);

/* Route dynamique  */
Mangarouter.get('/:id', getMangaById);

export default Mangarouter;
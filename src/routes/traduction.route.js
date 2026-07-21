import express from 'express';
import { getTranslations, updateTranslation, updateBulkTranslations } from '../controllers/TraductionController.js';


const traductionRouter = express.Router();

traductionRouter.get('/:lang', getTranslations);
traductionRouter.put('/:lang/bulk', updateBulkTranslations);
traductionRouter.put('/:lang', updateTranslation);

export default traductionRouter;
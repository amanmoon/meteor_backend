import express, { Request, Response, Router } from 'express';

import { createMeet } from "./meet/controllers/video.controllers"
const router = (): Router => {
    const appRouter = express.Router();

    appRouter.get('/room/create', createMeet);

    appRouter.get('/room/join', (req: Request, res: Response) => {
        res.send('About Us Page');
    });

    appRouter.use((req: Request, res: Response) => {
        res.status(404).send('Page Not Found');
    });

    return appRouter;
};

export default router;
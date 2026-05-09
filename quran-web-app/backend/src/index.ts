import cors from 'cors';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import { apiRouter } from './routes/quranRoutes.js';


const app = express();

// Configure CORS: allow origins from env var `ALLOWED_ORIGINS` (comma-separated),
// otherwise allow all origins (useful for quick deployments). For production
// set ALLOWED_ORIGINS to your frontend domain(s), e.g. https://your-app.vercel.app
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) : [];

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true
  })
);

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use('/api', apiRouter);

app.get('/', (_request, response) => {
  response.json({
    name: 'QuranNest API',
    status: 'ok'
  });
});

// Use the exact PORT provided by the environment (Render, Heroku, etc.)
const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`QuranNest API listening on port ${port}`);
});

export * from './services/quranDataService.js';
export * from './services/audioService.js';
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';

const app = express();

/* Middleware */

// CORS
app.use(cors());

// JSON body parser
app.use(express.json());

// HTTP logger
app.use(pinoHttp());

/* Routes */

// GET /notes — get all notes
app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

// GET /notes/:noteId — get note by ID
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;

  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

// Test error route
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

/* 404 Middleware */

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

/* Error Handler */

app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});

/* Server */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

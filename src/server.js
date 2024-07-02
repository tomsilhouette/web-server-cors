import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
// Path
import { join } from 'path';
import * as url from 'url';
// Env
import { HTTP_URL, PORT } from './utils/config.js';

const app = express();
app.disable('x-powered-by');

// Add middleware
app.use(
  cors({
    origin: 'https://ambitious-ocean-09f9fbd03-preview.westeurope.5.azurestaticapps.net/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create path to HTML
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// Server interface page
app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: join(__dirname, 'views'),
  });
});

app.get('/test-get', (req, res) => {
  res.status(200).send('hello get');
});

app.post('/test-post-working', (req, res) => {
  res.status(201).send({
    status: 'POST REQUEST RECIEVED',
    data: 'CORS policy was accepted',
  });
});

// For all unknown requests 404 page returns
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error.code === 'P2025') {
    return sendDataResponse(res, 404, 'Record does not exist');
  }

  return sendDataResponse(res, 500);
});

// Start our API server
app.listen(PORT, () => {
  console.log(
    `\nServer is running on ${HTTP_URL}${PORT} \n This no longer consumes souls\n`
  );
});

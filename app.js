import express from 'express';
import cookieParser from 'cookie-parser';
import {} from 'dotenv/config.js';
import { userRoutes } from './routes/user.routes.js';
import { STATUS_CODES } from './helpers/constants.js';
import { authRoutes } from './routes/auth.routes.js';
import { AppError, handleError } from './helpers/error.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import bodyParser from 'body-parser';
import upload from './middlewares/upload.middleware.js';

const app = express();


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // For parsing URL-encoded bodies
app.use(cookieParser());
//app.use(upload.single('file'));
// routes
authRoutes(app);
userRoutes(app);


app.post('/upload', upload.single('file'), (req, res) => {
  console.log('Ok');
  // Handle the uploaded file
  res.json({ message: 'File uploaded successfully!' });
});

app.all('*', (req, _, next) => {
  next(new AppError(`Can't find ${req.method} ${req.originalUrl} on this server!`, STATUS_CODES.NOT_FOUND));
});



// centralized error handling
app.use((err, req, res, _) => {
  handleError(err, req, res, _);
});



// running the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at ${PORT}`));

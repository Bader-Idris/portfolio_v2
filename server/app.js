const  path = require("path");
require("express-async-errors");
const express = require("express");
const app = express();

// const { parentPort } = require("worker_threads");
// https://www.digitalocean.com/community/tutorials/how-to-use-multithreading-in-node-js

const morgan = require("morgan");
// const session = require("express-session");
const cookieParser = require('cookie-parser');
// const { createClient } = require("redis");
// const RedisStore = require("connect-redis").default;
const fileUpload = require("express-fileupload");
//multer is way better, it has 180+ issues vs 3, and size is less than this express-fileupload
// const sharp = require("sharp");// with multer 😘
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
// const history = require("connect-history-api-fallback");//! looks useless
// const responseTime = require('response-time');//to monitor each endpoint
// const timeout = require("connect-timeout");// can be used specifically when not dealt by nginx
// const compression = require("compression");//use with statics

const { connectDB } = require("./db/connect");

// routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");
const receivedEmailsRouter = require("./routes/receivedEmailsRoutes");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  MONGO_DB_NAME,
  REDIS_URL,
  REDIS_PORT,
  REDIS_USER,
  REDIS_PASSWORD,
  SESSION_SECRET,
  JWT_SECRET,
} = require("./config/config");

app.enable("trust proxy");//derived from proxy-addr package

// Static files rate limiter
const staticFileLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Allow 1000 requests per 15 minutes for static files
  message: "Too many requests for static files. Please try again later.",
});

// API rate limiter
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Allow 60 requests per 15 minutes for API routes
  message: "Too many requests to the API. Please slow down.",
});

app.disable("x-powered-by");

app.use(
  helmet.contentSecurityPolicy({
    //this helmet stops any new api, keep an eye on it when adding new ones
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "https://raw.githubusercontent.com", "data:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      workerSrc: ["'self'", "blob:"],
    },
  })
);

app.use(
  cors({// you can add custom naming of cap app in its config, as origin
    origin: ["https://baderidris.com", "baderApp://localhost"], //  "http://localhost" for dev
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // Include common headers
    credentials: true, // Allow cookies and credentials
  })
);

app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(JWT_SECRET));
// if (process.env.NODE_ENV === "production") {
//   app.use("/statics", staticFileLimiter, express.static("./statics"));
// } else {
//   app.use("/statics", express.static("./statics"));
// }
app.use(express.static("./statics"));
app.use(fileUpload());

// Apply API rate limiter to API routes
// if (process.env.NODE_ENV === "production") {
//   app.use("/api", apiLimiter);
// }

if (process.env.NODE_ENV === "production") {
  app.use(staticFileLimiter);
}

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/received_emails', receivedEmailsRouter)

app.get("/robots.txt", (req, res) => {
  res.sendFile(path.resolve(__dirname, "/statics", "robots.txt"));
});

// app.use(
//   history({
//     appendSlash: true,
//     index: `${path.resolve(__dirname, "./statics", "index.html")}`,
//   })
// );

app.get("*", (req, res) => {//! check using compression package
  res.sendFile(path.resolve(__dirname, "./statics", "index.html"));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// docker exec -it my-blog-mongo mongo -u Bader -p myPassword --authenticationDatabase admin
// show dbs
// use <database_name>
// show collections
// db.<collection_name>
// db.<collection_name>.find()
// db.<collection_name>.find({ field: "value" })
const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin`;
const connectWithRetry = async () => {
  try {
    await connectDB(MONGO_URL);
    console.log("successfully connected to DB");
  } catch (e) {
    console.log("Error connecting to DB:", e);
    setTimeout(connectWithRetry, 5000);
    //TODO: if i send a warning message only once, it's better!
  }
};
connectWithRetry();

const port = process.env.PORT || 3000;
app.listen(port, () => 
  console.log( `Listening on port ${port}...` )
);
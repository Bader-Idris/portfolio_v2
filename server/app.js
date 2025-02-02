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
// const compression = require("compression");// nginx is better, if both are used, it'll reduce data transferred, so Use NGINX gzip alone
const passport = require("passport");

// TODO: check them out
// const hpp = require('hpp');
const slowDown = require("express-slow-down");

// Add DDoS protection middleware
// const ddos = require('ddos-protection');
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
require("./utils/passport")();

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

// Static files rate limiter
const staticFileLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Allow 1000 requests per 15 minutes for static files
  message: "Too many requests for static files. Please try again later.",
});

// API rate limiter
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Allow 60 requests per 15 minutes for API routes
  message: "Too many requests to the API. Please slow down.",
});

app.enable("trust proxy");//derived from proxy-addr package
app.disable("x-powered-by");

// Slow down repeated requests
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per windowMs
  delayMs: () => 500, // Begin adding 500ms of delay per request above 50
});

// Enhanced Security Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "https://www.google.com",
          "https://www.gstatic.com",
          "https://raw.githubusercontent.com",
          "data:",
        ],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        workerSrc: ["'self'", "blob:"],
        connectSrc: ["'self'"], // TODO: check these three, if they're affect the mobile app
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
      },
    },
    crossOriginResourcePolicy: { policy: "same-site" },
    permissionsPolicy: {
      features: {
        geolocation: ["'self'"],
        camera: ["'none'"],
        microphone: ["'none'"],
      },
    },
  })
);

app.use(
  cors({
    // you can add custom naming of cap app in its config, as origin
    origin: ["https://baderidris.com"], //  "http://localhost" for dev
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"], // Include common headers
    credentials: true, // Allow cookies and credentials
    maxAge: 86400, // 24 hours - The maximum amount of time the results of a preflight request can be cached.
    preflightContinue: false,
  })
);

app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieParser(JWT_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // TODO: will it work with mobile built apps!
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
);
// if (process.env.NODE_ENV === "production") {
//   app.use("/statics", staticFileLimiter, express.static("./statics"));
// } else {
//   app.use("/statics", express.static("./statics"));
// }
app.use(express.static("./statics"));
app.use(speedLimiter);
app.use(fileUpload());
app.use(passport.initialize());

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
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.resolve(__dirname, "/statics", "favicon.ico"));
});

// app.use(
//   history({
//     appendSlash: true,
//     index: `${path.resolve(__dirname, "./statics", "index.html")}`,
//   })
// );

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./statics", "index.html"));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
app.use(morgan("combined"));

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
const server = app.listen(port, () => {
  console.log(`Server running on port ${server.address().port}`);
});

// Server Hardening
server.setTimeout(10000); // 10 seconds timeout
server.headersTimeout = 15000; // 15 seconds headers timeout
server.keepAliveTimeout = 5000; // 5 seconds keep-alive timeout

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`[${new Date().toISOString()}] Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`[${new Date().toISOString()}] Unhandled Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});
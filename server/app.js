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
if (process.env.NODE_ENV === "production") {
  app.use(
    rateLimiter({
      windowMs: 15 * 60 * 1000,
      max: 60,
    })
  );
}
app.disable("x-powered-by");

// app.use(helmet({//this helmet stops any new api, keep an eye on it when adding new ones
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       // Add other CSP directives as needed [Content Security Policy]
//       scriptSrc: ["'self'", "http://app:3000", "'unsafe-inline'"],
//       frameSrc: ["'self'", "https://www.youtube.com"],
//       styleSrcElem: ["'self'", "https://fonts.googleapis.com"],
//     },
//   },
// }));
app.use(helmet());
app.use(cors());
// app.use(cors({
//   origin: 'http://testing.com',
//   optionsSuccessStatus: 200,
// }));
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(JWT_SECRET));
app.use(express.static("./statics"));//public
app.use(fileUpload());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);

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
    console.log(e);
    setTimeout(connectWithRetry, 5000);
    //TODO: if i send a warning message only once, it's better!
  }
};
connectWithRetry();

const port = process.env.PORT || 3000;
app.listen(port, () => 
  console.log( `Listening on port ${port}...` )
);
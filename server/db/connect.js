const mongoose = require("mongoose");
try {
  mongoose.set("strictQuery", false);
} catch (e) {
  console.log(e);
}
const connectDB = (url) => {
  return mongoose.connect(url);
};

module.exports =  { connectDB };
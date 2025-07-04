const mongoose = require('mongoose');
require("dotenv").config();
exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log("DB CONNECTED SUCCESSFULLY"))
        .catch((error) => {
            console.log("Error while DB connection");
            console.log("Error", error);
            process.exit(1); // Exit the App if Db connection failed
      })
}
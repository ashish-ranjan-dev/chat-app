const mongoose = require('mongoose');
const { DB_URL } = require("./server-config");

const connect = async () => {
     console.log(DB_URL);
    await mongoose.connect(DB_URL);
}

module.exports = connect;
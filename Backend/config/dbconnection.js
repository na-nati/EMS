const mongoose = require('mongoose');
const connectdb = async () => {
    try {
        const conn = await mongoose.connect(process.env.CONNECTION_STRING);

        console.log("MongoDB connected:", conn.connection.host, conn.connection.name);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};


module.exports = connectdb;
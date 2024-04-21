const mongoose = require("mongoose");
const { schema } = require("../Models/user");
const { horitas } = require("../Models/horas");

const MONGO_URL = "mongodb+srv://Nicolas_Oli:XNiUbtLHKl5Du5TS@bd-proyecto.efmj8sg.mongodb.net/?retryWrites=true&w=majority"

const db = async () => {
    try{
        const conn = await mongoose.connect(MONGO_URL);
        console.log("BD CONECTADA", conn.connection.host)
    } catch (error) {
        console.log(error)
    }
}

module.exports = db, schema, horitas;
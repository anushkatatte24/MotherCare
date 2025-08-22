const mongoose = require('mongoose')

// const mongoURL ="mongodb://tare:12210289@ac-qxkxy1g-shard-00-00.ig60ndc.mongodb.net:27017,ac-qxkxy1g-shard-00-01.ig60ndc.mongodb.net:27017,ac-qxkxy1g-shard-00-02.ig60ndc.mongodb.net:27017/BloomBaby?replicaSet=atlas-jpclvo-shard-0&ssl=true&authSource=admin"

// mongoose.connect(mongoURL)

const db = mongoose.connection;

// db.on('connected', ()=>{
//     console.log("Connected")
// })

// db.on('disconnected', ()=>{
//     console.log("Disconnected")
// })

// db.on('error', ()=>{
//     console.log("Error")
// })

main()
.then((res)=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/mothercare")
}

module.exports = db;
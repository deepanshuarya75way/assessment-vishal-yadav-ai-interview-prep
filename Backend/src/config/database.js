const mongoose=require("mongoose")

async function connectToDB(){
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017")
        console.log("Connected to Database")
    }
    catch(err){
        console.log(err)
    }
}
module.exports=connectToDB;
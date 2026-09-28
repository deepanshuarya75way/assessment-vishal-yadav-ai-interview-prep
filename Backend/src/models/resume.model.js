const mongoose=require("mongoose");

const resumeSchema=new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users",
    required:true
  },
  title:{
    tyep:String,
    required:true,
    default:"Untitled resume",
  },
  content:{
    type:String,
    required:true,
  },
  IsActive:{
    type:Boolean,
    default:false
  }
},{timestamps:true});

module.exports=mongoose.model("Resume",resumeSchema)
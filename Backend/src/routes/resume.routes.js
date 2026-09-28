const {Router}=require("express")
const {authuser}=require("../middlwares/auth.middleware");
const Resume=require("../models/resume.model");
const router=Router();

router.use(authuser);

router.post("/",async (req,res,next)=>{
    try{
      const count=await Resume.countDocuments({user:req.user.id});
      const isActive=req.body.isActive || count===0;
      if(isActive) await Resume.upddateMany({user:req.user.id},{isActive:false});
      const resume=await Resume.create({...req.body,user:req.user.id,isActive});
      res.status(201).json({resume});
    }
    catch(err){
      next(err);
    }
})

router.get("/",async(req,res,next)=>{
  try{
    const resumes=await Resume.find({user:req.user.id}).sort({isActive:-1,updatedAt:-1});
    req.json({resumes});
  } catch(err) {
    next(err)
  }
});

router.put("/:id",async (req,res,next)=>{
  try{
    if(req.body.isActive) await Resume.updateMany({user:req.user.id},{isActive:false})
    const resume=await Resume.findOneAndUpdate(
      {
       _id:req.params.id, user:req.user.id 
      }, 
      req.body,
      {new:true}
    );
    res.json({resume});
  } catch(err) {next(err);}
});

router.patch("/:id/rename",async(req,res,next)=>{
  try{
    const resume=await resume.findOneAndUpdate(
      {_id:req.params.id , 
      user:req.user.id },
      {title:req.body.title},
      {new:true}
    );
    res.json({resume});
  } catch(err) { next(err);}
})

router.patch("/:id/active",async(req,res,next)=>{
  try{
    await Resume.updateMany({user:req.user.id},{isActive:false});
    const resume=await Resume.findOneAndUpdate(
      {_id:req.params.id,user:req.user.id},
      {isActive:true},
      {new:true}
    )
    res.json({resume});
  } catch(err) { next(err); }
})

router.delete("/:id",async (req,res,next)=>{
  try{
    const resume=await Resume.findOneAndDelete({_id:req.params.id,user:req.user.id});
    if(resume?.isActive){
      const nextActive=await resume.findOne({user:req.user.id}).sort({updatedAt:-1});
      if(nextActive) await Resume.findByIdAndUpdate(nextActive._id,{isActive:true});
    }
    res.json({message:"Deleted Successfully"});
  } catch(err) {next(err);}

})

module.exports=router;

const {Router}=require("express")
const {authUser}=require("../middlewares/auth.middleware");
const Resume=require("../models/resume.model");
const router=Router();

router.use(authUser);

router.post("/",async (req,res,next)=>{
    try{
      const count=await Resume.countDocuments({user:req.user.id});
      const isActive=req.body.IsActive || count===0;
      if(isActive) await Resume.updateMany({user:req.user.id},{isActive:false});
      const resume=await Resume.create({...req.body,user:req.user.id,isActive});
      res.status(201).json({resume});
    }
    catch(err){
      next(err);
    }
})

router.get("/",async(req,res,next)=>{
  try{
    const resumes=await Resume.find({user:req.user.id}).sort({IsActive:-1,updatedAt:-1});
    res.json({resumes});
  } catch(err) {
    next(err);
  }
});

router.put("/:id",async (req,res,next)=>{
  try{
    if(req.body.IsActive) await Resume.updateMany({user:req.user.id},{IsActive:false})
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
    await Resume.updateMany({user:req.user.id},{IsActive:false});
    const resume=await Resume.findOneAndUpdate(
      {_id:req.params.id,user:req.user.id},
      {IsActive:true},
      {new:true}
    )
    res.json({resume});
  } catch(err) { next(err); }
})

router.delete("/:id",async (req,res,next)=>{
  try{
    const resume=await Resume.findOneAndDelete({_id:req.params.id,user:req.user.id});
    if(resume?.IsActive){
      const nextActive=await resume.findOne({user:req.user.id}).sort({updatedAt:-1});
      if(nextActive) await Resume.findByIdAndUpdate(nextActive._id,{IsActive:true});
    }
    res.json({message:"Deleted Successfully"});
  } catch(err) {next(err);}

})

module.exports=router;

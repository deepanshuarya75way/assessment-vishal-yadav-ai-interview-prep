import React,{useState,useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router";

const api=axios.create({
  baseURL:import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentails:true,
});

export default function ResumeManager(){
   const navigate=useNavigate();
   const [resumes,setResumes]=useState([]);
   const [editid,setEditid]=useState(null);
   const [title,setTitle]=useState("");
   const [content,setContent]=useState("");
   const [isActive,setIsActive]=useState(false);
   const [showPreview,setShowPreview]=useState(false);

   const fetchResumes=async ()=>{
    const res=await api.get("/api.resumes");
    setResumes(res.data.resumes || []);
   }

   useEffect(()=>{ fetchResumes();},[]);
   
   const handleSave=async(e)=>{
    e.preventDefault();
    if(!content.trim()) return alert("Content is required");
    if(editid){
      await api.put(`/api/resumes/${editid}`,{title,content,isActive});
    } else{
      await api.post("/api/resumes",{title:title || "Untitled resume",content,isActive});
    }
    resetform();
    fetchResumes();
   };

   const handleEdit=(r)=>{
    setEditid(r._id);
    setTitle(r.title);
    setContent(r.content);
    setIsActive(r.isActive);
    setShowPreview(False);
   }

   const handleSetActive=async (id)=>{
    await api.patch('/api/resumes/${id/active');
    fetchResumes();
   };

   const handleRename=async (id,oldTitle)=>{
    const newtitle=probmpt("Enter new title:",oldTitle);
    if(newtitle&&newtitle.trim()){
      await api.patch('/api/resumes/${id/rename',{
        title:newTitle.trim(),
      });
      fetchResumes();
    }
   };
   const handleDelete=async (id)=>{
    if(confirm("Dlete this version?")){
      await api.delete(`/api/resumes/${id}`);
      fetchResumes();
    }
   }

   const resetform=()=>{
    setEditid(null);
    setTitle("");
    setContent("");
    setIsActive(false);
    setShowPreview(false);
   }

   return (
    <div>
        <button onClick={()=>navigate("/")}>
          Back to Interview Prep
        </button>

        <h2>Resume version & Builder</h2>

        <div>
          <h3>
            {editid?"Edit Resume version":"Create New resume version"}
          </h3>

          <form onSubmit={handleSave}>
            <input placeholder="Version Title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
            <textarea placeholder="Write/Paste your resume content(full name,summary,skills,experience" rows={8} value={content} onChange={(e)=>setContent(e.target.value)}/>
           
           <div>
               <label>
                <input type="checkbox" checked={isActive} onChange={(e)=>setIsActive(e.target.checked)}/>
                Mark as Active Version
                </label>

                <button type="button" onClick={()=>setShowPreview(!showPreview)}>
                  {showPreview?"Hide Preview":"preview resume"}
                </button>

                <button type="submit">
                  {editid?"Update version":"Save version"}
                </button>

                {editid && (
                  <button type="button" onClick={resetform}>
                    Cancel
                  </button>
                )}
           </div>
          </form>
          {showPreview && (
             <div>
              <h4>{title || "Untitled Resume"}</h4>
              <div>
                {content || "No content entered yet."}
              </div>
             </div>
          )}
          <h3>All Resume Versions ({resumes.length})</h3>
          <div>
            {resumes.map((r)=>(
              <div key={r._id}>
                <div>
                  <strong>{r.title}</strong>
                  {r.isActive&&(
                    <span>
                      (active)
                    </span>
                  )}
                  <p>
                    Updated:{" "}
                    {new Date(r.updatedAt).toLocalString()}
                  </p>
                </div>
                <div>
                  {!r.isActive&&(
                    <button onClick={()=>handleSetActive(r._id)}>
                      Set Active
                    </button>
                  )}
                  <button onClick={()=>handleRename(r._id,r.title)}>Rename</button>
                  <button onClick={()=>handleEdit(r)}>Edit</button>

                  <button onClick={()=>handleDelete(r._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
   )
};

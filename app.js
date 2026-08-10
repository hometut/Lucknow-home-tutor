function toggleMenu(){document.getElementById("nav").classList.toggle("open")}

async function submitForm(formId, endpoint, msgId){
  const form=document.getElementById(formId);
  const msg=document.getElementById(msgId);
  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    msg.textContent="Submitting...";
    const data=Object.fromEntries(new FormData(form).entries());
    try{
      const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
      const result=await r.json();
      if(!r.ok) throw new Error(result.error||"Something went wrong");
      msg.textContent=result.message;
      msg.style.color="#16a34a";
      form.reset();
    }catch(err){
      msg.textContent=err.message;
      msg.style.color="#dc2626";
    }
  });
}
submitForm("studentForm","/api/student","studentMsg");
submitForm("tutorForm","/api/tutor","tutorMsg");
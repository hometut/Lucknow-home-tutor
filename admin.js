let auth="", items=[];

function login(){
  const u=document.getElementById("user").value;
  const p=document.getElementById("pass").value;
  auth="Basic "+btoa(u+":"+p);
  loadData(true);
}
async function loadData(fromLogin=false){
  try{
    const r=await fetch("/api/submissions",{headers:{Authorization:auth}});
    if(!r.ok) throw new Error("Invalid username or password");
    items=await r.json();
    document.getElementById("loginBox").hidden=true;
    document.getElementById("dashboard").hidden=false;
    render();
  }catch(e){
    document.getElementById("loginMsg").textContent=e.message;
    if(fromLogin) document.getElementById("dashboard").hidden=true;
  }
}
function render(){
  const q=document.getElementById("search").value.toLowerCase();
  const filter=document.getElementById("filter").value;
  const filtered=items.filter(x=>(filter==="all"||x.type===filter)&&JSON.stringify(x).toLowerCase().includes(q));
  document.getElementById("students").textContent=items.filter(x=>x.type==="student").length;
  document.getElementById("tutors").textContent=items.filter(x=>x.type==="tutor").length;
  document.getElementById("newCount").textContent=items.filter(x=>x.status==="new"||x.status==="pending").length;
  document.getElementById("list").innerHTML=filtered.map(x=>{
    const details=x.type==="student"
      ? `Class: ${x.studentClass}<br>Subject: ${x.subject}<br>Location: ${x.location}<br>Requirement: ${x.requirement||"-"}`
      : `Qualification: ${x.qualification}<br>Subjects: ${x.subjects}<br>Classes: ${x.classes}<br>Areas: ${x.areas}<br>Experience: ${x.experience||"-"}<br>Expected fee: ${x.fee||"-"}`;
    return `<div class="item">
      <h3>${escapeHtml(x.name)} <small>(${x.type})</small></h3>
      <div class="meta">Phone: ${escapeHtml(x.phone)}<br>Email: ${escapeHtml(x.email||"-")}<br>${details}<br>Status: <b>${escapeHtml(x.status)}</b></div>
      <div class="actions">
        <button class="ok" onclick="status(${x.id},'contacted')">Mark Contacted</button>
        <button onclick="status(${x.id},'approved')">Approve</button>
        <button class="danger" onclick="removeItem(${x.id})">Delete</button>
      </div>
    </div>`;
  }).join("") || "<p>No records found.</p>";
}
async function status(id,s){
  await fetch("/api/submissions/"+id,{method:"PATCH",headers:{"Authorization":auth,"Content-Type":"application/json"},body:JSON.stringify({status:s})});
  loadData();
}
async function removeItem(id){
  if(!confirm("Delete this record?")) return;
  await fetch("/api/submissions/"+id,{method:"DELETE",headers:{Authorization:auth}});
  loadData();
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
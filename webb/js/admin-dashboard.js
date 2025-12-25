// ================= TAB SWITCH =================
document.querySelectorAll(".nav-link").forEach(link=>{
  link.onclick = () => {
    document.querySelectorAll(".nav-link").forEach(l=>l.classList.remove("active"));
    link.classList.add("active");

    const view = link.dataset.view;
    document.getElementById("view-dashboard").classList.add("hidden");
    document.getElementById("view-students").classList.add("hidden");

    document.getElementById("view-" + view).classList.remove("hidden");
  };
});

// ================= LOAD DATA =================
async function loadDashboard(){
  const res = await fetch("/api/admin/users-progress");
  const data = await res.json();
  if(data.status!=="success") return;

  const users = data.users;

  // STATS
  totalUsers.innerText = users.length;
  completedUsers.innerText = users.filter(u=>u.average>=70).length;
  avgProgress.innerText =
    Math.round(users.reduce((a,b)=>a+b.average,0)/users.length)+"%";

  // TABLE (HỌC VIÊN)
  userTable.innerHTML="";
  users.forEach(u=>{
    userTable.innerHTML+=`
      <tr>
        <td>${u.username}</td>
        <td>${u.email}</td>
        <td>
          ${u.average}%
          <div class="progress">
            <span style="width:${u.average}%"></span>
          </div>
        </td>
        <td>
          <button class="detail-btn"
            onclick='openModal(${JSON.stringify(u)})'>
            Chi tiết
          </button>
        </td>
      </tr>
    `;
  });

  renderCharts(users);
}

// ================= CHARTS =================
function renderCharts(users){
  new Chart(completionChart,{
    type:"doughnut",
    data:{
      labels:["Hoàn thành","Đang học","Chưa bắt đầu"],
      datasets:[{
        data:[
          users.filter(u=>u.average>=70).length,
          users.filter(u=>u.average>=30&&u.average<70).length,
          users.filter(u=>u.average<30).length
        ],
        backgroundColor:["#22c55e","#facc15","#ef4444"]
      }]
    }
  });

  new Chart(avgChart,{
    type:"bar",
    data:{
      labels:users.map(u=>u.username),
      datasets:[{
        label:"Tiến độ (%)",
        data:users.map(u=>u.average),
        backgroundColor:"#38bdf8"
      }]
    },
    options:{
      scales:{y:{beginAtZero:true,max:100}}
    }
  });
}

// ================= MODAL =================
function openModal(user){
  modalUsername.innerText=user.username;
  modalEmail.innerText=user.email;

  modalProgress.innerHTML="";
  const p=user.progress||{};
  if(!Object.keys(p).length){
    modalProgress.innerHTML="<p>❌ Chưa làm lab</p>";
  }else{
    Object.entries(p).forEach(([lab,val])=>{
      modalProgress.innerHTML+=`
        <div class="lab-item">
          <strong>${lab.replace(/_/g," ")}</strong> – ${val}%
          <div class="lab-progress">
            <span style="width:${val}%"></span>
          </div>
        </div>
      `;
    });
  }

  studentModal.classList.remove("hidden");
}

function closeModal(){
  studentModal.classList.add("hidden");
}

loadDashboard();

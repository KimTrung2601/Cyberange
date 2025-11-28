// --- PHẦN 1: CHẠY KHI TRANG VỪA TẢI XONG ---
document.addEventListener('DOMContentLoaded', () => {

  // 1. KIỂM TRA BẢO MẬT (Chưa đăng nhập là đuổi)
  const currentUser = localStorage.getItem("cyber_current_user");
  if (!currentUser) {
      alert("⚠️ Bạn chưa đăng nhập!");
      window.location.href = "index.html";
      return; // Dừng code tại đây
  }

  // 2. HIỂN THỊ TÊN USER
  const el = document.getElementById("sidebar-username");
  if (el) el.textContent = currentUser;

  // 3. XỬ LÝ CHUYỂN TAB SIDEBAR
  const navItems = document.querySelectorAll(".nav-item");
  const mainViews = document.querySelectorAll(".view");

  navItems.forEach((btn) => {
      btn.addEventListener("click", () => {
          navItems.forEach(b => b.classList.remove("active"));
          mainViews.forEach(v => v.classList.remove("active"));
          
          btn.classList.add("active");
          
          const viewId = "view-" + btn.dataset.view;
          const view = document.getElementById(viewId);
          if(view) view.classList.add("active");
      });
  });

  // 4. XỬ LÝ TAB CON TRONG PLAYLIST
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
          tabButtons.forEach(b => b.classList.remove('active'));
          tabContents.forEach(c => c.classList.remove('active'));

          btn.classList.add('active');

          const tabId = "tab-" + btn.dataset.tab;
          const content = document.getElementById(tabId);
          if(content) content.classList.add('active');
      });
  });

  // 5. TÌM KIẾM (Search)
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
      searchInput.addEventListener("input", () => {
          const kw = searchInput.value.toLowerCase().trim();
          const activeContent = document.querySelector('.tab-content.active');
          if(!activeContent) return;

          const cards = activeContent.querySelectorAll(".playlist-card");
          cards.forEach((card) => {
              const text = (card.dataset.title || card.innerText).toLowerCase();
              card.style.display = text.includes(kw) ? "block" : "none";
          });
      });
  }
}); 
// --- KẾT THÚC PHẦN DOMContentLoaded ---


// --- PHẦN 2: HÀM ĐĂNG XUẤT (NẰM RIÊNG Ở NGOÀI CÙNG) ---
// Đặt ở đây đảm bảo nút bấm luôn gọi được, bất chấp lỗi ở trên
window.xuLyDangXuat = function() {
  console.log("Đã bấm nút đăng xuất!"); 

  if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
      // 1. Xóa thông tin user
      localStorage.removeItem("cyber_current_user");

      // 2. Thông báo
      alert("Đã đăng xuất thành công!");

      // 3. Chuyển về trang đăng nhập
      window.location.href = "index.html"; 
  }
};

async function loadUserProgress() {
  const username = localStorage.getItem("cyber_current_user");
  if (!username) return;

  try {
      const res = await fetch('/api/get-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username })
      });

      const data = await res.json();
      console.log("Tiến độ nhận từ server:", data);

      if (data.status !== 'success') return;

      const progress = data.progress || {};

      // ----- ARP Spoofing -----
      const arpPercent = progress["arp_spoofing"] || 0;
      const arpBar   = document.getElementById("arp_spoofing-bar");
      const arpText  = document.getElementById("arp_spoofing-text");
      if (arpBar)  arpBar.style.width = arpPercent + "%";
      if (arpText) arpText.innerText  = arpPercent + "%";

      // ----- DHCP Attack -----
      const dhcpPercent = progress["dhcp_attack"] || 0;
      const dhcpBar   = document.getElementById("dhcp_attack-bar");
      const dhcpText  = document.getElementById("dhcp_attack-text");
      if (dhcpBar)  dhcpBar.style.width = dhcpPercent + "%";
      if (dhcpText) dhcpText.innerText  = dhcpPercent + "%";

      // tấn công mật khẩu
      const brutePercent = progress["brute_force_ssh"] || 0;
      const bruteBar = document.getElementById("brute_force_ssh-bar");
      const bruteText = document.getElementById("brute_force_ssh-text");
      if (bruteBar) bruteBar.style.width = brutePercent + "%";
      if (bruteText) bruteText.innerText = brutePercent + "%";

      //dns psn
      const dnsPercent = progress["dns_psn"] || 0;
      const dnsBar = document.getElementById("dns_psn-bar");
      const dsnText = document.getElementById("dns_psn-text")
      if(dnsBar) dnsBar.style.width = dnsPercent + "%";
      if(dsnText) dsnText.innerText = dnsPercent + "%";
      //leothang
      const chiemPercent = progress["chiem_q"] || 0;
      const chiemBar = document.getElementById("chiem_q-bar");
      const chiemText = document.getElementById("chiem_q-text")
      if(chiemBar) chiemBar.style.width = chiemPercent + "%";
      if(chiemText) chiemText.innerText = chiemPercent + "%";

      //soc
      const SOCPercent = progress["soc_en"] || 0;
      const socBar = document.getElementById("soc_en-bar");
      const socText = document.getElementById("soc_en-text")
      if(socBar) socBar.style.width = SOCPercent + "%";
      if(socText) socText.innerText = SOCPercent + "%";

    ///////PHONGTHU/////////////

    //ARP
      const ptARPPercent = progress["phongthu_arp"] || 0;
      const ptarpBar = document.getElementById("phongthu_arp-bar");
      const ptarpText = document.getElementById("phongthu_arp-text")
      if(ptarpBar) ptarpBar.style.width = ptARPPercent + "%";
      if(ptarpText) ptarpText.innerText = ptARPPercent + "%";

    /// ting tong
    const allValues = Object.values(progress)
            .map(v => Number(v) || 0)
            // nếu muốn chỉ tính những lab đã làm ( > 0 ) thì lọc như dưới:
            .filter(v => v > 0);

        let avg = 0;
        if (allValues.length > 0) {
            const sum = allValues.reduce((a, b) => a + b, 0);
            avg = Math.round(sum / allValues.length);   // làm tròn
        }

        // Cập nhật thanh tổng
        const overallBar  = document.getElementById("overall-progress-bar");
        const overallText = document.getElementById("overall-progress-text");
        if (overallBar)  overallBar.style.width = avg + "%";
        if (overallText) overallText.innerText  = avg + "%";

        // Cập nhật thanh mini góc phải
        const miniFill   = document.getElementById("global-mini-fill");
        const miniText   = document.getElementById("global-mini-percent");
        if (miniFill) miniFill.style.width = avg + "%";
        if (miniText) miniText.innerText   = avg + "%";


  } catch (err) {
      console.error("Lỗi load progress:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadUserProgress);

document.addEventListener("DOMContentLoaded", loadUserProgress);

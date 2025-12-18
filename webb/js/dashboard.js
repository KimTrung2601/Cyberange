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
// --- PHẦN 2: HÀM ĐĂNG XUẤT (MỚI - ĐẸP KHÔNG DÙNG CONFIRM) ---
window.xuLyDangXuat = function () {
    const modal = document.getElementById("logout-modal");
    modal.classList.add("show");

    // Nút đồng ý đăng xuất
    document.getElementById("logout-confirm").onclick = () => {
        localStorage.removeItem("cyber_current_user");

        // toast đẹp
        showToast("Đã đăng xuất thành công!", "success");

        modal.classList.remove("show");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    };

    // Nút hủy
    document.getElementById("logout-cancel").onclick = () => {
        modal.classList.remove("show");
    };
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
      const SOCPercent = progress["zphisher_fb"] || 0;
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

    //DHCP
    const ptDHCPPercent = progress["phongthu_dhcp"] || 0;
    const ptdhcpBar = document.getElementById("phongthu_dhcp-bar");
    const ptdhcpText = document.getElementById("phongthu_dhcp-text")
    if(ptdhcpBar) ptdhcpBar.style.width = ptDHCPPercent + "%";
    if(ptdhcpText) ptdhcpText.innerText = ptDHCPPercent + "%";
    //DNS
    const ptDNSPercent = progress["phongthu_dns"] || 0;
    const ptdnsBar = document.getElementById("phongthu_dns-bar");
    const ptdnsText = document.getElementById("phongthu_dns-text")
    if(ptdnsBar) ptdnsBar.style.width = ptDNSPercent + "%";
    if(ptdnsText) ptdnsText.innerText = ptDNSPercent + "%";
    //BRF
    const ptBRFPercent = progress["phongthu_brf"] || 0;
    const ptbrfBar = document.getElementById("phongthu_brf-bar");
    const ptbrfText = document.getElementById("phongthu_brf-text")
    if(ptbrfBar) ptbrfBar.style.width = ptBRFPercent + "%";
    if(ptbrfText) ptbrfText.innerText = ptBRFPercent + "%";
//soc
    const ptSOCPercent = progress["phongthu_soc"] || 0;
    const ptsocBar = document.getElementById("phongthu_soc-bar");
    const ptsocText = document.getElementById("phongthu_soc-text")
    if(ptsocBar) ptsocBar.style.width = ptSOCPercent + "%";
    if(ptsocText) ptsocText.innerText = ptSOCPercent + "%";
//nguoidung
    const ptNGPercent = progress["phongthu_nguoidung"] || 0;
    const ptngBar = document.getElementById("phongthu_nguoidung-bar");
    const ptngText = document.getElementById("phongthu_nguoidung-text")
    if(ptngBar) ptngBar.style.width = ptNGPercent + "%";
    if(ptngText) ptngText.innerText = ptNGPercent + "%";

    /// ting tong
   /// ting tong  (tính tổng tiến độ 9 lab cố định)
        const TOTAL_LABS = 12;   // số lab cố định

        // Lấy toàn bộ giá trị progress, lab nào chưa có thì coi như 0
        const allValues = Object.values(progress || {});

        // Tính tổng %
        const sum = allValues.reduce((acc, v) => acc + (Number(v) || 0), 0);

        // % trung bình trên 9 lab (0–100%)
        const avg = Math.round(sum / TOTAL_LABS);   // ví dụ: [100,80,0,60,0] => 240/5 = 48%


        // Cập nhật thanh tổng
        //const overallBar  = document.getElementById("overall-progress-bar");
       // const overallText = document.getElementById("overall-progress-text");
        //if (overallBar)  overallBar.style.width = avg + "%";
       // if (overallText) overallText.innerText  = avg + "%";

        // Cập nhật thanh mini góc phải 
        const miniFill   = document.getElementById("global-mini-fill");
        const miniText   = document.getElementById("global-mini-percent");
        if (miniFill) miniFill.style.width = avg + "%";
        if (miniText) miniText.innerText   = avg + "%";

      // ===== HIỆN NÚT XUẤT CHỨNG CHỈ KHI ĐẠT >= 80% =====
        const btnCert = document.getElementById("btn-certificate");

        if (btnCert) {
            if (avg >= 20) {
                btnCert.style.display = "block";
            } else {
                btnCert.style.display = "none";
            }

            btnCert.onclick = () => {
                const username = localStorage.getItem("cyber_current_user") || "Học viên";

                window.open(
                    `/certificate.html?name=${encodeURIComponent(username)}&score=${avg}`,
                    "_blank"
                );
            };
        }

  } catch (err) {
      console.error("Lỗi load progress:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadUserProgress);



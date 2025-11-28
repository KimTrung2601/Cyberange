/**
 * AUTH.JS - Xử lý Đăng ký / Đăng nhập kết nối với Backend Node.js
 */
console.log("File auth.js mới đã được tải!"); // Thêm dòng này vào đầu file
// ... code phía dưới giữ nguyên
// 1. Giữ nguyên hàm Toggle Password (hiện/ẩn mật khẩu)
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon = btn.querySelector("i");
  if (!input) return;

  if (input.type === "password") {
      input.type = "text";
      icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
      input.type = "password";
      icon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

// 2. Xử lý ĐĂNG KÝ (REGISTER) - Đã sửa để gọi API
const regForm = document.getElementById("register-form");
if (regForm) {
  regForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Lấy thẻ HTML
      const userInput = document.getElementById("reg-username");
      const emailInput = document.getElementById("reg-email");
      const passInput = document.getElementById("reg-password");

      // Lấy thẻ báo lỗi
      const userErr = document.getElementById("reg-user-error");
      const emailErr = document.getElementById("reg-email-error");
      const passErr = document.getElementById("reg-pass-error");

      // Reset báo lỗi
      userErr.style.display = "none";
      emailErr.style.display = "none";
      passErr.style.display = "none";

      // Lấy giá trị
      const u = userInput.value.trim();
      const em = emailInput.value.trim();
      const pw = passInput.value.trim();
      let ok = true;

      // Validate cơ bản ở Frontend
      if (!u) {
          userErr.style.display = "block";
          ok = false;
      }
      if (!em || !em.includes("@")) {
          emailErr.style.display = "block";
          ok = false;
      }
      if (!pw) {
          passErr.style.display = "block";
          ok = false;
      }
      if (!ok) return;

      // --- GỬI DỮ LIỆU XUỐNG SERVER ---
      try {
          const btn = regForm.querySelector("button");
          const oldText = btn.innerText;
          btn.innerText = "Đang xử lý...";
          btn.disabled = true;

          const response = await fetch('/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: u, email: em, password: pw })
          });

          const data = await response.json();

          if (data.status === 'success') {
              alert("✅ " + data.message);
              window.location.href = "index.html"; // Chuyển về đăng nhập
          } else {
              alert("❌ " + data.message);
          }

          // Trả lại nút bấm
          btn.innerText = oldText;
          btn.disabled = false;

      } catch (err) {
          console.error(err);
          alert("Lỗi kết nối Server! Bạn đã bật 'node server.js' chưa?");
      }
  });
}

// 3. Xử lý ĐĂNG NHẬP (LOGIN) - Đã sửa để gọi API
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const idInput = document.getElementById("login-identifier"); // Username hoặc Email
      const passInput = document.getElementById("login-password");
      const idError = document.getElementById("login-id-error");
      const passError = document.getElementById("login-pass-error");

      idError.style.display = "none";
      passError.style.display = "none";

      const id = idInput.value.trim();
      const pw = passInput.value.trim();
      let ok = true;

      if (!id) { idError.style.display = "block"; ok = false; }
      if (!pw) { passError.style.display = "block"; ok = false; }
      if (!ok) return;

      // --- GỌI API LOGIN ---
      try {
          const response = await fetch('/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: id, password: pw })
          });

          const data = await response.json();

          if (data.status === 'success') {
              // Lưu thông tin người dùng vào localStorage để dùng cho các trang sau
              localStorage.setItem("cyber_current_user", data.user.username);
              alert("Đăng nhập thành công!");
              window.location.href = "dashboard.html";
          } else {
              alert("❌ " + data.message);
          }
      } catch (err) {
          console.error(err);
          alert("Lỗi kết nối Server!");
      }
  });
}
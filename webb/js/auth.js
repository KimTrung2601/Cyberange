/**
 * AUTH.JS - Xử lý Đăng ký / Đăng nhập kết nối với Backend Node.js
 */
console.log("File auth.js mới đã được tải!");

// ===================== 1. Toggle Password =====================
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

// ===================== 2. ĐĂNG KÝ (REGISTER) =====================
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
      const btn = regForm.querySelector("button[type='submit']");
      const oldText = btn.innerText;
      btn.innerText = "Đang xử lý...";
      btn.disabled = true;

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, email: em, password: pw }),
      });

      const data = await response.json();

      if (data.status === "success") {
        showToast("✅ " + data.message, "success");

        setTimeout(() => {
          window.location.href = "index.html"; // quay về trang đăng nhập
        }, 1200);
      } else {
        showToast("❌ " + data.message, "error");
      }

      btn.innerText = oldText;
      btn.disabled = false;
    } catch (err) {
      console.error(err);
      showToast(
        "Lỗi kết nối Server! Bạn đã bật 'node server.js' chưa?",
        "error"
      );
    }
  });
}

// ===================== 3. ĐĂNG NHẬP (LOGIN) =====================
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

    if (!id) {
      idError.style.display = "block";
      ok = false;
    }
    if (!pw) {
      passError.style.display = "block";
      ok = false;
    }
    if (!ok) return;

    try {
      const btn = loginForm.querySelector("button[type='submit']");
      const oldText = btn.innerText;
      btn.innerText = "Đang đăng nhập...";
      btn.disabled = true;

      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: id, password: pw }),
      });

      const data = await response.json();

      if (data.status === "success") {
        // Lưu thông tin người dùng vào localStorage để dùng cho các trang sau
        if (data.user && data.user.username) {
          localStorage.setItem("cyber_current_user", data.user.username);
        }

        showToast("🎉 Đăng nhập thành công!", "success");

        setTimeout(() => {
          window.location.href = "dashboard.html"; // vào dashboard
        }, 1200);
      } else {
        showToast("❌ " + data.message, "error");
      }

      btn.innerText = oldText;
      btn.disabled = false;
    } catch (err) {
      console.error(err);
      showToast("Lỗi kết nối Server!", "error");
    }
  });
}

// ===================== 4. HÀM HIỂN THỊ TOAST =====================
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  // Nếu chưa có div#toast thì fallback sang alert để khỏi bị đứng
  if (!toast) {
    alert(message);
    return;
  }

  // reset class
  toast.className = "toast";
  if (type === "error") {
    toast.classList.add("error");
  }

  toast.textContent = message;

  // Hiện toast
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // Ẩn toast sau 1.5s
  setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}

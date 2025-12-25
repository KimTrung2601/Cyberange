const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// ================== CẤU HÌNH ==================
const DATA_FILE = path.join(__dirname, "users.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../webb")));

// ================== HÀM HỖ TRỢ ==================
function getUsersFromFile() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveUsersToFile(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), "utf8");
}

// ================== ROUTE CƠ BẢN ==================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../webb/index.html"));
});

// ================== AUTH ==================
app.post("/api/register", (req, res) => {
  const { username, password, email } = req.body;
  const users = getUsersFromFile();

  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.status(400).json({
      status: "error",
      message: "Tài khoản đã tồn tại"
    });
  }

  users.push({
    username,
    password,
    email,
    progress: {}
  });

  saveUsersToFile(users);

  res.json({
    status: "success",
    message: "Đăng ký thành công"
  });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const users = getUsersFromFile();

  const user = users.find(
    u =>
      (u.username === username || u.email === username) &&
      u.password === password
  );

  if (!user) {
    return res.status(401).json({
      status: "error",
      message: "Sai tài khoản hoặc mật khẩu"
    });
  }

  res.json({
    status: "success",
    message: "Đăng nhập thành công",
    user: {
      username: user.username,
      email: user.email
    }
  });
});

// ================== QUIZ / PROGRESS ==================
app.post("/api/submit-quiz", (req, res) => {
  const { username, labId, progress } = req.body;
  const users = getUsersFromFile();

  const index = users.findIndex(u => u.username === username);
  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: "Không tìm thấy user"
    });
  }

  if (!users[index].progress) {
    users[index].progress = {};
  }

  const oldProgress = users[index].progress[labId] || 0;

  if (progress > oldProgress) {
    users[index].progress[labId] = progress;
    saveUsersToFile(users);
  }

  res.json({
    status: "success",
    message: "Đã cập nhật tiến độ"
  });
});

app.post("/api/get-progress", (req, res) => {
  const { username } = req.body;
  const users = getUsersFromFile();

  const user = users.find(u => u.username === username);

  res.json({
    status: "success",
    progress: user?.progress || {}
  });
});

// ================== ADMIN DASHBOARD API ==================
app.get("/api/admin/users-progress", (req, res) => {
  const users = getUsersFromFile();

  const result = users.map(u => {
    const progress = u.progress || {};
    const values = Object.values(progress);

    const average = values.length
      ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
      : 0;

    return {
      username: u.username,
      email: u.email,
      progress,
      average
    };
  });

  res.json({
    status: "success",
    users: result
  });
});

// ================== START SERVER ==================
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

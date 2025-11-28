const fs = require("fs");
const path = require("path");

const userFile = path.join(__dirname, "../data/users.json");

function readUsers() {
  if (!fs.existsSync(userFile)) return [];
  const raw = fs.readFileSync(userFile);
  return JSON.parse(raw || "[]");
}

function writeUsers(users) {
  fs.writeFileSync(userFile, JSON.stringify(users, null, 2));
}

exports.register = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Thiếu email hoặc password" });

  const users = readUsers();
  const existed = users.find((u) => u.email === email);
  if (existed)
    return res.status(400).json({ message: "Email đã tồn tại" });

  users.push({ email, password });
  writeUsers(users);

  res.json({ message: "Đăng ký thành công" });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const users = readUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user)
    return res.status(401).json({ message: "Sai email hoặc mật khẩu" });

  res.json({
    message: "Đăng nhập thành công",
    user: { email },
  });
};

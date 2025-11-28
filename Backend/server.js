const express = require('express');
const path = require('path');
const fs = require('fs'); // Thư viện đọc ghi file
const app = express();
const port = 3000;

// Đường dẫn đến file lưu dữ liệu
const DATA_FILE = path.join(__dirname, 'users.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../webb')));

// --- HÀM TRỢ GIÚP: ĐỌC DỮ LIỆU TỪ FILE ---
function getUsersFromFile() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return []; 
    }
}

// --- HÀM TRỢ GIÚP: GHI DỮ LIỆU VÀO FILE ---
function saveUsersToFile(users) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// Route trang chủ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../webb/index.html'));
});

// --- API ĐĂNG KÝ ---
app.post('/api/register', (req, res) => {
    const { username, password, email } = req.body;
    const users = getUsersFromFile();

    // Kiểm tra trùng
    const userExists = users.find(u => u.username === username);
    if (userExists) {
        return res.status(400).json({ status: 'error', message: 'Tài khoản đã tồn tại!' });
    }

    // Thêm người mới
    const newUser = { username, password, email, progress: {} };
    users.push(newUser);
    saveUsersToFile(users);

    console.log("Đã lưu user mới:", newUser);
    res.json({ status: 'success', message: 'Đăng ký thành công!' });
});

// --- API ĐĂNG NHẬP ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = getUsersFromFile();
    
    const user = users.find(u => 
        (u.username === username || u.email === username) && u.password === password
    );

    if (user) {
        res.json({ 
            status: 'success', 
            message: 'Đăng nhập thành công!',
            user: { username: user.username, email: user.email }
        });
    } else {
        res.status(401).json({ status: 'error', message: 'Sai tài khoản hoặc mật khẩu!' });
    }
});

// ============================================================
// 👇 PHẦN QUAN TRỌNG ĐÃ SỬA (CHỈ CÒN 1 BẢN DUY NHẤT) 👇
// ============================================================

// --- API 1: LƯU TIẾN ĐỘ (NHẬN SỐ %) ---
app.post('/api/submit-quiz', (req, res) => {
    const { username, labId, progress } = req.body; 

    console.log(`User [${username}] cập nhật bài [${labId}] -> Mức độ: ${progress}%`);

    const users = getUsersFromFile();
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex !== -1) {
        if (!users[userIndex].progress) {
            users[userIndex].progress = {};
        }

        // Chỉ lưu nếu tiến độ mới CAO HƠN tiến độ cũ
        const oldProgress = users[userIndex].progress[labId] || 0;
        
        if (progress > oldProgress) {
            users[userIndex].progress[labId] = progress;
            saveUsersToFile(users); 
            console.log("-> Đã lưu thành công!");
        } else {
            console.log("-> Tiến độ thấp hơn cũ, bỏ qua.");
        }

        res.json({ status: 'success', message: 'Đã cập nhật tiến độ!' });
    } else {
        res.status(404).json({ status: 'error', message: 'Không tìm thấy user!' });
    }
});

// --- API 2: LẤY TIẾN ĐỘ ---
app.post('/api/get-progress', (req, res) => {
    const { username } = req.body;
    const users = getUsersFromFile();
    const user = users.find(u => u.username === username);

    if (user && user.progress) {
        res.json({ status: 'success', progress: user.progress });
    } else {
        res.json({ status: 'success', progress: {} });
    }
});

const PORT = process.env.PORT || port;

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

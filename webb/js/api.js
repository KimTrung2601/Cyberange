// API URL — trỏ về backend Render
const API_URL = "https://cyberange.onrender.com";

// Gửi request POST login
async function login(email, password) {
    const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });
    return res.json();
}

// Gửi request đăng ký
async function register(username, email, password) {
    const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
    });
    return res.json();
}

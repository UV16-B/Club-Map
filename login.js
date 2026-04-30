const ADMIN_LOGIN = "admin"; const ADMIN_PASSWORD = "12345";
function login() {
    const l = document.getElementById("login").value;
    const p = document.getElementById("password").value;
    if (l === ADMIN_LOGIN && p === ADMIN_PASSWORD) {
        localStorage.setItem("isAdmin", "true"); // для сохранения меток на стороне клиента
        window.location.href = "admin.html";
    }
    else alert("Доступ запрещен");
}
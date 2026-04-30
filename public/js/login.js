const ADMIN_LOGIN = "admin"; const ADMIN_PASSWORD = "12345";
function login() {
    const l = document.getElementById("login").value;
    const p = document.getElementById("password").value;
    if (l === ADMIN_LOGIN && p === ADMIN_PASSWORD) window.location.href = "/admin";
    else alert("Доступ запрещен");
}
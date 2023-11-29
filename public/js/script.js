/**
 * register() used to show register form and hide user login form and admin login form
 */
function register() {
    document.getElementById("formRegister").style.display = "block"
    document.getElementById("formLogin").style.display = "none"
    document.getElementById("adminLogin").style.display = "none"
}
/**
 * login() used to show login form and hide admin login form and register form
 */
function login() {
    document.getElementById("formLogin").style.display = "block"
    document.getElementById("formRegister").style.display = "none"
    document.getElementById("adminLogin").style.display = "none"
}
/**
 * adminLogin() used to show admin login form and hide user login form and register form
 */
function adminLogin() {
    document.getElementById("formLogin").style.display = "none"
    document.getElementById("formRegister").style.display = "none"
    document.getElementById("adminLogin").style.display = "block"
}
/**
 * back() used to show the main content
 */
function back() {
    document.getElementById("mainContent").style.display = "block";
}
/**
 * registerUser() handles registration for user
 */
function registerUser() {
    var s = document.getElementById("user").value
    var p = document.getElementById("password").value
    var h = document.getElementById("email").value
    console.log(s);
    console.log(h)
    console.log(p);
    var nobj = {
        username: s,
        password: p,
        email: h,
        role: "user"
    }
    let req = new XMLHttpRequest();
    req.open("POST", "http://localhost:3000/register", true)
    req.setRequestHeader("Content-type", "application/json");
    req.send(JSON.stringify(nobj));
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 201) {
                console.log(JSON.stringify(req.response));
                document.getElementById("formLogin").style.display = "block";
                document.getElementById("formRegister").style.display = "none";

            }

        }
    }
}
/**
 * loginUser() handles login for user
 */
function loginUser() {
    let user = document.getElementById("username").value;
    let pwd = document.getElementById("pwd").value;
    let req = new XMLHttpRequest();
    let newobj = {
        username: user,
        password: pwd
    }
    req.open("POST", "http://localhost:3000/login", true);
    req.setRequestHeader("Content-type", "application/json");
    req.send(JSON.stringify(newobj));
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                var k = JSON.parse(req.responseText);
                console.log(k.token);
                console.log(k.user.username);
                localStorage.setItem("Token", k.token);
                localStorage.setItem("Username", k.user.username);
                loadUser();
            }
            else {
                alert("Login failed...Check your credentials")
            }

        }

    }
}
/**
 * loadUser() handles user authentication
 */
function loadUser() {
    let req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000/auth-user", true);
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("x-user-auth-token", localStorage.getItem("Token"));
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                window.location.href = "user.html";
            }

        }
    }
}
/**
 * loginAdmin() handles login for admin
 */
function loginAdmin() {
    let g = document.getElementById("adminname").value;
    let h = document.getElementById("adminpwd").value;
    let req = new XMLHttpRequest();
    let newobj = {
        username: g,
        password: h,
    }
    req.open("POST", "http://localhost:3000/admin-login", true);
    req.setRequestHeader("Content-type", "application/json");
    req.send(JSON.stringify(newobj));
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                var k = JSON.parse(req.responseText);
                console.log(k.token);
                localStorage.setItem("Token", k.token);
                loadAdmin();
            } else {
                alert("Login failed...Check your credentials")
            }
        }
    }
}
/**
 * loadAdmin() handles admin authentication
 */
function loadAdmin() {
    let req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000/auth-admin", true);
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("x-admin-auth-token", localStorage.getItem("Token"));
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                window.location.href = "admin.html";
            }
        }
    }
}
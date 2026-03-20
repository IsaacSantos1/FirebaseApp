const toggleDarkMode = () => {
    const body = document.body;
    const nav = document.querySelector("nav");
    const container = document.querySelector(".container");
    body.classList.toggle("dark-mode");
    nav.classList.toggle("dark-mode");
    container.classList.toggle("dark-mode");
    

if (body.classList.contains("dark-mode") && nav.classList.contains("dark-mode") && container.classList.contains("dark-mode") ) {
        localStorage.setItem("theme", "dark");
        alert("Dark mode enabled");
        
    } else {
        localStorage.setItem("theme", "light");
        alert("Dark mode disabled");
    }
};

document.addEventListener("DOMContentLoaded", (event) => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        const nav = document.querySelector("nav");
        nav.classList.add("dark-mode");
        const container = document.querySelector(".container");
        container.classList.add("dark-mode");
        const loginContainer = document.querySelector(".login-container");
        loginContainer.classList.add("dark-mode");
    }
});
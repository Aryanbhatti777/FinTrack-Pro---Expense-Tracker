const username_header = document.querySelector(".name")
const user = JSON.parse(localStorage.getItem("user"))

username_header.innerHTML = user.username
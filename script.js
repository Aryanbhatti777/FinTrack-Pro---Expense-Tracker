const username_header = document.querySelector(".name")
const user = JSON.parse(localStorage.getItem("user"))
const addTransactionBtn = document.querySelector("#openAddModalBtn")
const txForm = document.querySelector(".add_transaction")
const closeForm = document.querySelector(".close-modal")

// make transaction form visible and hidden

addTransactionBtn.addEventListener("click", () => {
    txForm.style.display = "flex"
})

closeForm.addEventListener("click", () => {
    txForm.style.display = "none"
})

// set username in header

username_header.innerHTML = user.username

// theme changing

 const darkModeToggle = document.getElementById('darkModeToggle');
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        darkModeToggle.checked = true;
    }
    darkModeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });
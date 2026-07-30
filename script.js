const username_header = document.querySelector(".name")
const user = JSON.parse(localStorage.getItem("user"))
const addTransactionBtn = document.querySelector("#openAddModalBtn")
const txForm = document.querySelector(".add_transaction")
const closeForm = document.querySelector(".close-modal")
const form = document.querySelector("form");
const transactionStorageKey = `transactions_${user.username}`


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


//add transaction


form.addEventListener("submit", (e) => {
    e.preventDefault();

    const tx_type = form.type.value
    const description = form.description.value;
    const amount = form.amount.value 
    const tx_date = form.Tdate.value 
    const category = form.category.value;
    
    if(description.trim() === "" || amount.trim() === "" ||  category.trim() === ""){
        alert("All fields are mandatory")
    }

    const newTransaction = {
        id: Date.now(),
        transactionType : tx_type,
        description,
        amount,
        transactionDate : tx_date,
        category
    }
    
    const transactions = JSON.parse(localStorage.getItem(transactionStorageKey)) || []

    transactions.push(newTransaction)

    localStorage.setItem(transactionStorageKey, JSON.stringify(transactions))

    console.log(transactions)

})

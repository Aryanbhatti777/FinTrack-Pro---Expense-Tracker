const username_header = document.querySelector(".name")
let user = JSON.parse(localStorage.getItem("user"))
const addTransactionBtn = document.querySelector("#openAddModalBtn")
const txForm = document.querySelector(".add_transaction")
const closeForm = document.querySelector(".close-modal")
const form = document.querySelector("#transactionForm");
let transactionStorageKey = `transactions_${user.username}`
const tableData = document.querySelector("#transactionTableBody")
const displayBalance = document.querySelector("#displayBalance")
const displayIncome = document.querySelector("#displayIncome")
const displayExpense = document.querySelector("#displayExpense")
const displayCount = document.querySelector("#displayCount")
const resetBtn = document.querySelector("#resetDataBtn")
let transactions = JSON.parse(localStorage.getItem(transactionStorageKey)) || []
let txFormBtn = document.querySelector(".txform-btn")
const ctx = document.querySelector("#cashFlowChart")
const searchInput = document.querySelector("#searchInput")
const searchType = document.querySelector("#typeFilter")
let chart = null
let editingId = null
const dashboardBtn = document.querySelector("#dashboardLink")
const settingsBtn = document.querySelector("#settingsLink")
const dashboardView = document.querySelector("#dashboard-view")
const settingsForm = document.querySelector("#settingsForm")
const settingsView = document.querySelector("#settings-view")


// make transaction form visible and hidden

addTransactionBtn.addEventListener("click", () => {
    form.reset()
    editingId = null
    txForm.style.display = "flex"
    txFormBtn.innerText = "Save Transaction"
})

dashboardBtn.addEventListener("click", () => {
    dashboardView.style.display = "block"
    dashboardBtn.classList.add("active")
    settingsView.style.display = "none"
    settingsBtn.classList.remove("active")
})

settingsBtn.addEventListener("click", () => {
    settingsView.style.display = "block"
    settingsBtn.classList.add("active")
    dashboardView.style.display = "none"
    dashboardBtn.classList.remove("active")
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

    if (description.trim() === "" || amount.trim() === "" || category.trim() === "") {
        alert("All fields are mandatory")
        return
    }

    

    const newTransaction = {
        id: editingId ? editingId : Date.now(),
        transactionType: tx_type,
        description,
        amount,
        transactionDate: tx_date,
        category
    }

    if(editingId !== null){
        transactions = transactions.map(tx => tx.id === editingId ? newTransaction : tx)
        editingId = null
    }else{
        transactions.push(newTransaction)
    }

    

    localStorage.setItem(transactionStorageKey, JSON.stringify(transactions))

    form.reset()

    txForm.style.display = "none"

    updateUi()

})

// delete Transaction

const deleteTransaction = (id) => {

    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(tx => tx.id !== id);
        updateUi();
    }


}

// edit Transaction

const editTransaction = (id) => {
    const transaction = transactions.find(tx => tx.id === id)
    editingId = transaction.id;
    form.type.value = transaction.transactionType;
    form.description.value = transaction.description;
    form.amount.value = transaction.amount;
    form.Tdate.value = transaction.transactionDate;
    form.category.value = transaction.category

    txFormBtn.innerText = "Update Transaction"
    txForm.style.display = "flex"
}



// update ui

const updateUi = (dataToShow = transactions) => {

    tableData.innerHTML = ""

    
    const currency = user.currency || "$"

    let totalIncome = 0;
    let totalExpense = 0;

    if (dataToShow.length === 0) {
        tableData.innerHTML = `
    <tr>
        <td colspan="5">
            No Transactions.
        </td>
    </tr>
`;
    }


    dataToShow.forEach(tx => {

        if (tx.transactionType === "income") {
            totalIncome += Number(tx.amount)
        } else {
            totalExpense += Number(tx.amount)
        }

        const color_class = tx.transactionType === "income" ? "text-green" : "text-red";
        const sign = tx.transactionType === "income" ? "+" : "-"
        const tr = document.createElement("tr")

        tr.innerHTML = `
    <td>${tx.transactionDate}</td>
    <td><strong>${tx.description}</strong></td>
    <td>
        <span class="tag">${tx.category}</span>
    </td>
    <td class="${color_class}">
        ${sign}${currency}${tx.amount}
    </td>
    <td>
        <button
            class="action-btn btn-edit"
            onclick="editTransaction(${tx.id})"
        >
            <i class="fa-solid fa-pen"></i>
        </button>

        <button
            class="action-btn btn-delete"
            onclick="deleteTransaction(${tx.id})"
        >
            <i class="fa-solid fa-trash"></i>
        </button>
    </td>
`;

        tableData.append(tr);
    })

    const balance = totalIncome - totalExpense

    displayBalance.textContent = `${balance < 0 ? "-" : ""}${currency}${Math.abs(balance).toFixed(2)}`


    displayIncome.textContent = `${currency}${totalIncome.toFixed(2)}`

    displayExpense.textContent = `${currency}${totalExpense.toFixed(2)}`

    displayCount.textContent = transactions.length

    localStorage.setItem(transactionStorageKey, JSON.stringify(transactions));

    updateChart(totalIncome, totalExpense)

}

// Chart 

const updateChart = (income, expense) => {
    if (chart) { chart.destroy() }
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Income vs Expense"],
            datasets: [
                { label: "Income", data: [income], backgroundColor: '#166534', borderRadius: 4 },
                { label: "Expense", data: [expense], backgroundColor: '#991b1b', borderRadius: 4 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { position: 'top' } }
        }
    })
}

//reset data

resetBtn.addEventListener("click", () => {
    if (confirm("WARNING: This will delete all your transaction data permanently!")) {
        localStorage.removeItem(transactionStorageKey)
        transactions = []
    } else {
        return
    }

    updateUi()
})

//settings

settingsForm.username.value = user.username
settingsForm.currency.value = user.currency

settingsForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let username = settingsForm.username.value;
    let currency = settingsForm.currency.value;

    if (username !== user.username) {
            const newStorageKey = `transactions_${username}`;
            localStorage.setItem(newStorageKey, JSON.stringify(transactions));
            localStorage.removeItem(transactionStorageKey); // Clean up old data
            transactionStorageKey = newStorageKey; // Update active key
        }
    const newUser = {
        username,
        currency
    }

    localStorage.setItem("user", JSON.stringify(newUser))

    user = newUser;

    username_header.textContent = user.username;

    alert("Data updated successfully")
    updateUi()
})

//filters

const applyFilter = () => {
    const inputValue = searchInput.value.toLowerCase();
    const typeValue = searchType.value;

    const filtered = transactions.filter(tx => {
        const inputMatched = tx.description.toLowerCase().includes(inputValue) || tx.category.toLowerCase().includes(inputValue)

        const typeMatched = (typeValue === "all") || (tx.transactionType === typeValue)

        return inputMatched && typeMatched
    })

    updateUi(filtered)
}

searchInput.addEventListener("input", applyFilter)
searchType.addEventListener("change", applyFilter)

updateUi()
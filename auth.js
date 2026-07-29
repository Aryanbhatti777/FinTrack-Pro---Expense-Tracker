

const Register = (username, password) => {

    if(username.trim() === "" || password.trim() === ""){
        alert("All fields are mandatory")
    }

    const users = JSON.parse(localStorage.getItem("users")) || []

    const exist = users.find(u => u.username === username)

    if(exist){
        alert("Username already exists!")
        return
    }

    const newUser = {
        username,
        password,
        currency : "$"
    }

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users))

    return { success: true, message: "Registered successfully, you can login now."}
}
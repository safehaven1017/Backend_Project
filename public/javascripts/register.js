const registerForm = document.querySelector('#registerForm')
registerForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // example using fetch
    // fetch('/api/v1/users/register', {
    //   method: "POST",
    //   body: JSON.stringify({
    //     name: 'a',
    //     email: 'b',
    //     password: 'c'
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })

    axios.post('/api/v1/users/register', {
        username: document.querySelector('#username').value,
        password: document.querySelector('#password').value
    })
        .then(res => {
            console.log(document.querySelector('#username').value)
            alert('User created successfully')
            window.location = '/login.html'
        })
        .catch(error => {
            console.log(error.response)
            alert(error.response.data.error || 'something went wrong')
        })
})
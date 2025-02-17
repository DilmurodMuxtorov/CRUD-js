//api link

const URL = 'https://63f703db833c7c9c607b2f24.mockapi.io/api/users';
//


const __tBody = document.getElementById('tBody');
const __modalBtn = document.getElementById('modal-btn');
const __modal = document.getElementById('modal');
const __form = document.getElementById('form');
const __btnColse = document.getElementById('btnClose')



//oyna ochilganda isha tushsin


window.onload = async () => {
    render(await getUsers())
}


//API Ma'lumotlarni olish.


async function getUsers() {
    loading(true)
    try {
        const response = await fetch(URL);
        const body = await response.json()
        loading(false)
        return body
    } catch (error) {
        errorMessage(error.message)
    }
}

//Apidan kelgan ma'lumotlarni chiqarish. Ma'lumotlarni chiqarish uchun.
function render(users) {
    let html = ''
    users.forEach(user => {
        html += `
    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
    <td class="px-6 py-4">
    ${user.id}
    </td>
    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
     ${user.name}
    </th>
    <td class="px-6 py-4">
    @${user.surname}
    </td>
    <td class="px-6 py-4">
    ${user.age} yers old
    </td>
    <td class="px-6 py-4">
    ${user.job}
    </td>
    <td class="px-6 py-4">
    ${user.salary}$
    </td>
    <td class="justify-between mt-4"">
    <button class="px-4 py-2 rounded bg-green-300" onclick="getIdToUpdate(${user.id})">edit</button>
    <button class="px-4 py-2 rounded bg-red-400 text-white" onclick="deleteUsers(${user.id})">delete</button>
    </td>
    </tr>
    `
        __tBody.innerHTML = html
    });
}


//loading funksiyasi
async function loading(state) {
    const __loading = document.getElementById('loading')
    if (state) {
        __loading.classList.add('block')
    }
    else {
        __loading.classList.add('hidden')
    }
}




//Agar xatolik bo'lsa Eror berish uchun.
function errorMessage(message) {
    document.body.innerHTML = `
    <section class="section">
    <div class="heading">
      <h1>Error?</h1>
    </div>
    <div class="content">
      <h2>Page not found (404)</h2>
      <p>${message}</p>
      <a href="#">Take me home</a>
    </div>
  </section>
`}


// Create " malumotlarni chiqarish bo'limi"



//Ul dan olish

__form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const { name, userName, age, job, salary } = e.target.elements;

    const postData = {
        name: name.value,
        surname: userName.value,
        age: age.value,
        job: job.value,
        salary: salary.value,
    }

    if (e.target.dataset.type) {
        await updateUser(postData, e.target.dataset.type)
        e.target.removeAttribute('data-type')
        
    }
    else {

        await createUser(postData);
    }
    __modal.classList.add('hidden')
    
})


//jonatish bekkentgaa.

async function createUser(user) {
    try {
        const jsonData = JSON.stringify(user)
        const response = await fetch(URL, {
            method: 'POST',
            body: jsonData,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
        render(await getUsers())
    } catch (error) {
        errorMessage(error.message)
    }
}


// Modalni ochish.
__modalBtn.addEventListener('click', () => {
    __modal.classList.remove('hidden')
})



// #Cole orqali  madalni yopish.
// __btnColse.addEventListener('click', () => {
//     __modal.classList.add('hidden')
// })




//Modalga bosganda yopish.
__modal.addEventListener('click', (e) => {
    if (e.target.matches('#modal')) {
        __modal.classList.add('hidden')
    }
    if (e.target.matches('#btnClose')) {
        __modal.classList.add('hidden')
    }
})




//delete
async function readUsers() {
    try {
        const response = await fetch(URL)
        const body = await response.json()
        return body
    } catch (error) {
        errorMessage(error.message)
    }
}
//delete
async function deleteUsers(id) {
    try {
        await fetch(`${URL}/${id}`, {
            method: 'DELETE'
        })
        render(await readUsers())

    } catch (error) {
        errorMessage(error.message)
    }
}

//edit
async function updateUser(user, id) {
    loading(true)
    try {
        const jsonData = JSON.stringify(user)
        await fetch(`${URL}/${id}`, {
            method: 'PUT',
            body: jsonData,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
        render(await readUsers())
        __form.reset()
        // removeEventListener('submit',onSubmit)
    } catch (error) {
        errorMessage(error.message)
    }
}

async function getIdToUpdate(id) {
    __form.setAttribute('data-type', id);


    const { name, userName, age, salary } = __form.elements;


    const user = (await readUsers()).find(el => el.id == id);

    name.value = user.name;

    userName.value = user.surname;

    age.value = user.age;

    job.value = user.job;

    salary.value = user.salary;
    render(await getUsers())

    __modal.classList.remove('hidden')
}


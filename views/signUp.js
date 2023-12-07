

const form = document.getElementById("formfield");
const msg = document.getElementById('message');

form.addEventListener("submit",signup_details);


function signup_details(e){
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const password = e.target.password.value;
    console.log(`name:${name},email:${email},phone:${phone},password:${password}`);
    const obj = {
        name:name,
        email:email,
        phone:phone,
        password:password
    }
    axios.post("http://localhost:4000/signup",obj)
    .then(res =>{
       msg.style = "display:flex";
       msg.style = "color:red";
       msg.textContent = res.data.message;
       if (res.status === 201){
        //    window.location.href = '../login/login.html';
       }
    })
    .catch(err => {
        console.log(err);
        if(err.response.status === 409){
         msg.style = "display:flex";
         msg.style = "color:red";
         msg.textContent = err.response.data.message;
        }else{
         msg.style = "display:flex";
         msg.style = "color:red";
         msg.textContent = err.response.data.message;
        }
     })

}
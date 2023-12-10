const popup = document.getElementById("popup");

document.addEventListener("DOMContentLoaded", function () {
    const signupLinks = document.querySelectorAll(".signup-link");
   
    const closePopup = document.getElementById("closePopup");
    const signinForm = document.getElementById("signinForm");
    const signupForm = document.getElementById("signupForm");

    signupLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            popup.style.display = "block";
      signinForm.style.display = "none";
      signupForm.style.display = "block";
        });
      });
   
    closePopup.addEventListener("click", function () {
      popup.style.display = "none";
    });
  
    window.addEventListener("click", function (event) {
      if (event.target === popup) {
        popup.style.display = "none";
      }
    });
  });

  

const form = document.getElementById("formField");
// const msg = document.getElementById('message');



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
      //  msg.style = "display:flex";
      //  msg.style = "color:red";
      //  msg.textContent = res.data.message;
      alert(`${res.data.message}`);
      e.target.name.value = "";
      e.target.email.value = "";
      e.target.phone.value = "";
      e.target.password.value = "";
       if (res.status === 201){
        popup.style.display = "block";
        signinForm.style.display = "block";
        signupForm.style.display = "none";
       }
    })
    .catch(err => {
        console.log(err);
        if(err.response.status === 409){
        //  msg.style = "display:flex";
        //  msg.style = "color:red";
        //  msg.textContent = err.response.data.message;
        alert(`${err.response.data.message}`);
        }else{
        //  msg.style = "display:flex";
        //  msg.style = "color:red";
        //  msg.textContent = err.response.data.message;
        alert(`${err.response.data.message}`);
        }
     })

}
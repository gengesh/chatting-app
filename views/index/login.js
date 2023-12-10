
document.addEventListener("DOMContentLoaded", function () {
    const signinLinks = document.querySelectorAll(".signin-link");
    const popup = document.getElementById("popup");
    const closePopup = document.getElementById("closePopup");
    const signupForm = document.getElementById("signupForm");
    const signinFrom = document.getElementById('signinForm');

    signinLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            popup.style.display = "block";
            signupForm.style.display = "none";
            signinFrom.style.display = "block";
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
  
  const formfield = document.getElementById('formField1');
  // const msg1 = document.getElementById('message1');


formfield.addEventListener('submit',login_details);

function login_details(e){
    e.preventDefault();
    const email = e.target.email1.value;
    const password = e.target.password1.value;
    console.log(`email:${email},password:${password}`);
    const obj = {
      email:email,
      password:password
  }
  axios.post('http://localhost:4000/login',obj)
  .then(response => {
    console.log("response1",response);
   if (response.status === 200) {
    // msg1.style.display = "flex";
    // msg1.style.color = "red";
    // msg1.textContent = "Login successful";
    alert(`${response.data.message}`);
    e.target.email1.value = "";
    e.target.password1.value = "";
     localStorage.setItem('token', response.data.token);
   } 
 })
 .catch(err => {
   console.log("Error in status:", err.response.status);
   if(err.response.status === 401) {
    // msg1.style.display = "flex";
    // msg1.style.color = "red";
    // msg1.textContent = "Password is incorrect";
    alert(`${err.response.data.message}`);
    console.log('Password is incorrect.');
  } else if (err.response.status === 404) {
    // msg1.style.display = "flex";
    // msg1.style.color = "red";
    // msg1.textContent = "Email ID not found";
    alert(`${err.response.data.message}`);
    console.log('Email ID not found');
  } else {
    // msg1.style.display = "flex";
    // msg1.style.color = "red";
    alert(`${response.status}`);
    // msg1.textContent = "Request failed with status: " + err.response.status;
    console.log('Request failed with status: ' + err.response.status);
  }
 });


}
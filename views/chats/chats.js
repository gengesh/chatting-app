
document.addEventListener("DOMContentLoaded", function() {
   const recentGroupId = 0;
    showGroupList(recentGroupId);
//    chatboxLoad();
   
});
// const socket = io();

const formElements = {
    messageInput: message_form.querySelector('input[name="Message"]'),
    message_btn: message_form.querySelector('input[type="submit"]'),
    flexSwitch:message_form.querySelector('#flexSwitch'),
    flexLabel:message_form.querySelector('label'),
    flexInput:message_form.querySelector('#flexInput')
}

// const flexSwitch = message_form.querySelector('#flexSwitch');

formElements.flexSwitch.addEventListener('change',()=>{
    if(formElements.flexLabel.innerText === "text"){
        formElements.flexLabel.innerText = "image";
        formElements.flexInput.setAttribute('accept','image/*');
        formElements.flexInput.type="file"
    }else{
        formElements.flexLabel.innerText = "text"
        formElements.flexInput.removeAttribute('accept');
        formElements.flexInput.type="text"
    }
})

document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.clear();
    window.location.href = '../index/index.html'; 
});

function OnlineToggleDropdown() {
    const dropdownContent = document.getElementById('OnlineDropdownContent');
    dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
}

socket.on('user-connected', name => {
    appendMessage(name)
  })
  
  socket.on('user-disconnected', name => {
    appendMessage(name)
  })
  
  
  function appendMessage(message) {
  var dropdownContent = document.getElementById('OnlineDropdownContent');
                  // Check if the item already exists
                  var existingItem = Array.from(dropdownContent.children).find(function(item) {
                    return item.textContent.trim() === message;
                });
        
                if (existingItem) {
                    // If the item exists, remove it
                    dropdownContent.removeChild(existingItem);
                }
        
                // Add the new item
                var newItem = document.createElement('a');
                newItem.href = '#';
                newItem.textContent = message;
                dropdownContent.appendChild(newItem);
            }


async function chatboxLoad(){
    const content = document.getElementsByClassName('content');
    const loadPreviousMsgButton = document.createElement('button');
    loadPreviousMsgButton.textContent = 'Load Previous Msg';
    loadPreviousMsgButton.id = 'premsg';

    content[0].appendChild(loadPreviousMsgButton);
    const token = localStorage.getItem('token');
    const recentId = 0;
    let groupId = localStorage.getItem('groupId');
    if(!groupId){
        groupId = null;
    }
   await axios.get(`http://localhost:4000/msg/${recentId}?groupId=${groupId}`,{headers:{"Authorization":token}})
    .then((response) => {
        const allmsg = response.data.messages;
        localStorage.setItem('allmsgs', JSON.stringify(allmsg));
        console.log("ls msgs:",allmsg);
       

        createMsg(allmsg);
         
}).catch(error => {
    console.error("Error fetching messages:", error);
});
}

socket.on('chat message', ({ message, name }) => {
    console.log('msg is socket:',message);
    console.log('name is socket:',name);
    const content = document.getElementsByClassName('content');
    const premsg = document.getElementById('premsg');
    premsg.addEventListener('click',loadpremsg);
      const p = document.createElement('p');
      const details = `${name}: <br> ${message}`;
        p.innerHTML = details;
        p.style.backgroundColor = 'yellow';
        p.style.padding = '10px';
        p.style.width = '50%';
        p.style.border = '1px solid black';
        p.style.marginLeft = '10px';
        p.style.borderRadius = '10px';
        content[0].appendChild(p);
        window.scrollTo(0, document.body.scrollHeight);
});

socket.on('image message',({image,name}) => {
    console.log('msg is socket:',image);
    console.log('name is socket:',name);
    const content = document.getElementsByClassName('content');
    const premsg = document.getElementById('premsg');
    premsg.addEventListener('click',loadpremsg);
    const a = document.createElement('a');
const img = document.createElement('img');

 img.style.width = '100px'; // Set to your preferred width
 img.style.height = 'auto'; // Maintain aspect ratio
// Set the image source using the provided imageURL
const imageURL = image; // Replace 'your-image-url.jpg' with the actual URL
img.src = imageURL;
img.alt = 'Image Alt Text'; // Provide alt text for accessibility

// Set the link href to the image URL
a.href = imageURL;

a.appendChild(img);

// Add styling to the <a> tag
a.style.display = 'block'; // To make it a block element
a.style.backgroundColor = 'yellow';
a.style.padding = '10px';
a.style.width = '50%';
a.style.border = '1px solid black';
a.style.marginLeft = '10px';
a.style.borderRadius = '10px';

// Append the <a> tag to the content container
content[0].appendChild(a);

// Scroll to the bottom of the page
window.scrollTo(0, document.body.scrollHeight);

})

function createMsg(msg){
       const content = document.getElementsByClassName('content');
       const premsg = document.getElementById('premsg');
       premsg.addEventListener('click',loadpremsg);
       let start = 0;
        if(msg.length>10)
         start = msg.length-10;
       for(let i =start;i<msg.length;i++){
        if(!msg[i].isImage){
         const p = document.createElement('p');
         const details = `${msg[i].name}: <br> ${msg[i].msg}`;
           p.innerHTML = details;
           p.style.backgroundColor = 'yellow';
           p.style.padding = '10px';
           p.style.width = '50%';
           p.style.border = '1px solid black';
           p.style.marginLeft = '10px';
           p.style.borderRadius = '10px';
           content[0].appendChild(p);
           window.scrollTo(0, document.body.scrollHeight);
        }else{
            const a = document.createElement('a');
        const img = document.createElement('img');
        
         img.style.width = '100px'; // Set to your preferred width
         img.style.height = 'auto'; // Maintain aspect ratio
        // Set the image source using the provided imageURL
        const imageURL = msg[i].msg; // Replace 'your-image-url.jpg' with the actual URL
        img.src = imageURL;
        img.alt = 'Image Alt Text'; // Provide alt text for accessibility
        
        // Set the link href to the image URL
        a.href = imageURL;
        
        a.appendChild(img);
        
        // Add styling to the <a> tag
        a.style.display = 'block'; // To make it a block element
        a.style.backgroundColor = 'yellow';
        a.style.padding = '10px';
        a.style.width = '50%';
        a.style.border = '1px solid black';
        a.style.marginLeft = '10px';
        a.style.borderRadius = '10px';
        
        // Append the <a> tag to the content container
        content[0].appendChild(a);
        
        // Scroll to the bottom of the page
        window.scrollTo(0, document.body.scrollHeight);
        
        }
       }

    }


const send = document.getElementById('sendid');

// send.addEventListener('click',sendMsg);
formElements.message_btn.addEventListener('click', sendMsg);

// var intervalId;

async function sendMsg(e){

    if (e.target && message_form.checkValidity()) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    let groupId = localStorage.getItem('groupId');

    if(formElements.flexLabel.innerText === "text"){
    // const msg = document.getElementById('msg').value;
   
    if(!groupId){
        groupId = null;
    }
    const data = {
        msg : formElements.messageInput.value,
        groupId:groupId
    }
    // document.getElementById('msg').value = '';
 await axios.post(`http://localhost:4000/msg`,data,{headers:{"Authorization":token}})
.then(res => {
    const message = res.data.message.msg;
    console.log(res.data.message.msg);
    const name = res.data.message.name;
    console.log(res.data.message.name);
    socket.emit('chat message', { message, name });
    // const storedData = localStorage.getItem('allmsgs');
    // const allmsgs = JSON.parse(storedData);
    // if(message){
    // allmsgs.push(message);
    // localStorage.setItem('allmsgs', JSON.stringify(allmsgs));
    // const messages = [];
    // messages.push(message);
        // createMsg(messages);
    // }
})
    .catch(error => {
        console.error("Error fetching messages:", error);
    });
} 
    else{
        const file = formElements.messageInput.files[0]
        if (file && file.type.startsWith('image/')){
            const formData = new FormData();
            formData.append('image', file);
            formData.append('GroupId',groupId)
            const imageResponse = await axios.post(`http://localhost:4000/image`,formData,{headers:{"Authorization":token}});
            // alert('Please select a valid image file.');
            console.log(imageResponse);
            const image = imageResponse.data.imgval.msg;
            const name = imageResponse.data.imgval.name;
            socket.emit('image message',{image,name});
        }              
    }
}
}
//  intervalId = setInterval(updateMsg, 1000);
// updateMsg();


// async function updateMsg(){
//     const token = localStorage.getItem('token');
//     const storedData = localStorage.getItem('allmsgs');
//     const allmsgs = JSON.parse(storedData);
//     console.log("totalmsgs length:",allmsgs.length);
//     let recenId = 0;
//     let groupId = localStorage.getItem('groupId');
//     if(!groupId){
//         groupId = null;
//     }
//     if(allmsgs.length){
//      recenId =  allmsgs[allmsgs.length-1].id
//     }
//     await axios.get(`http://localhost:4000/msg/${recenId}?groupId=${groupId}`,{headers:{"Authorization":token}})
// .then(res => {
//     // console.log(res.data.messages);
//     const messages = res.data.messages;
//     const content = document.getElementsByClassName('content');

//     for(let i =0;i<messages.length;i++){
//         // const p = document.createElement('p');
//         // const details = `${messages[i].name}: <br> ${messages[i].msg}`;
         
//           allmsgs.push(messages[i]);
//       }
//       if(messages.length){
//       localStorage.setItem('allmsgs', JSON.stringify(allmsgs));
//       createMsg(messages);
//       }
//     }).catch(err => {
//         console.log("error:",err);
//     })   
// }
// }

function loadpremsg(e){
    e.preventDefault();
     const button = document.getElementById("premsg");
     
     const storedData = localStorage.getItem('allmsgs');
    const allmsgs = JSON.parse(storedData);
    if (button.innerHTML === 'Load Previous Msg') {
        // clearInterval(intervalId);
        button.innerHTML = "Hide";
        
         console.log('this is load');
   
    const content = document.getElementsByClassName('content');
    console.log("all msgs is :",allmsgs);
    //  while (content[0].firstChild) {
    //        content[0].removeChild(content[0].firstChild);
    //    }
    // const noofmsg = allmsgs.length >=10 ? 10 : allmsgs.length;
   if(allmsgs.length>10){
    // var newChild = document.createElement("div");
            
    for(let i=allmsgs.length-11;i>=0;i--){
        const p = document.createElement('p');
         const details = `${allmsgs[i].name}: <br> ${allmsgs[i].msg}`;
           p.innerHTML = details;
           p.style.backgroundColor = 'yellow';
           p.style.padding = '10px';
           p.style.width = '50%';
           p.style.border = '1px solid black';
           p.style.marginLeft = '10px';
           p.style.borderRadius = '10px';
   
    var firstChild =  content[0].firstChild;

    // Insert the new element before the first child
     content[0].insertBefore(p, firstChild);
    }
    var firstChild =  content[0].firstChild;
     content[0].insertBefore(button,firstChild)
    } 
}else {
        const content = document.getElementsByClassName('content');
        button.innerHTML = "Load Previous Msg";
        // intervalId = setInterval(getNewMsgs, 1000);
        for(let i=allmsgs.length-11;i>=0;i--) {
                   content[0].removeChild(content[0].firstChild);
               }
        var firstChild =  content[0].firstChild;

            // Insert the new element before the first child
             content[0].insertBefore(button, firstChild);
        
    }
   
}


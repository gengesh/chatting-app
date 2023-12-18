
document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem('token');
    const lastmsgid = 0;
    axios.get(`http://localhost:4000/msg/${lastmsgid}`,{headers:{"Authorization":token}})
    .then(response => {
        localStorage.setItem('allmsgs', JSON.stringify(response.data.messages));
        console.log("ls msgs:",response.data.messages);

        const content = document.getElementsByClassName('content');
         const loadPreviousMsgButton = document.createElement('button');
    loadPreviousMsgButton.textContent = 'Load Previous Msg';
    loadPreviousMsgButton.id = 'premsg';

         content[0].appendChild(loadPreviousMsgButton);
       const premsg = document.getElementById('premsg');
       premsg.addEventListener('click',loadpremsg);
       const allmsgs = response.data.messages;
       const lastmsgid = allmsgs.length >=10 ? allmsgs.length-10 : allmsgs.length;
       for(let i =lastmsgid;i<allmsgs.length;i++){
         const p = document.createElement('p');
           const details = `${allmsgs[i].name} : ${allmsgs[i].msg}`;
           p.textContent = details;
           content[0].appendChild(p);
       }
    //    messages.forEach(item =>{
    //        const p = document.createElement('p');
    //        const details = `${item.name} : ${item.msg}`;
    //        p.textContent = details;
    //        content[0].appendChild(p);
        
    //    })
    }).catch(error => {
        console.error("Error fetching messages:", error);
    });
})

const send = document.getElementById('sendid');

send.addEventListener('click',sendMsg);

var intervalId;

function sendMsg(e){
    e.preventDefault();
    const msg = document.getElementById('msgs').value;
    console.log("msg is ",msg);
    const token = localStorage.getItem('token');
    const storedData = localStorage.getItem('allmsgs');
    const allmsgs = JSON.parse(storedData);
    const lastmsgid = allmsgs.length >=10 ? allmsgs.length-10 : allmsgs.length;
    const obj = {
        msg:msg
    }
    document.getElementById('msgs').value = '';
 axios.post(`http://localhost:4000/msg/${lastmsgid}`,obj,{headers:{"Authorization":token}})
.then(res => {
    console.log(res.data.messages);
    const messages = res.data.messages;
    const content = document.getElementsByClassName('content');
    const loadPreviousMsgButton = document.createElement('button');
    loadPreviousMsgButton.textContent = 'Load Previous Msg';
    loadPreviousMsgButton.id = 'premsg';

        while (content[0].firstChild) {
           content[0].removeChild(content[0].firstChild);
       }
       content[0].appendChild(loadPreviousMsgButton);
       const premsg = document.getElementById('premsg');
premsg.addEventListener('click',loadpremsg);
       messages.forEach(item =>{
           const p = document.createElement('p');
           const details = `${item.name} : ${item.msg}`;
           p.textContent = details;
           content[0].appendChild(p);
        
       })
    })
}

 intervalId = setInterval(getNewMsgs, 1000);
// getNewMsgs();


function getNewMsgs(){
    const token = localStorage.getItem('token');
    const storedData = localStorage.getItem('allmsgs');
    const allmsgs = JSON.parse(storedData);
    console.log("totalmsgs length:",allmsgs.length);
    const lastmsgid = allmsgs.length >=10 ? allmsgs.length-10 : allmsgs.length;
    axios.get(`http://localhost:4000/msg/${lastmsgid}`,{headers:{"Authorization":token}})
.then(res => {
    // console.log(res.data.messages);
    const messages = res.data.messages;
    const content = document.getElementsByClassName('content');
    const loadPreviousMsgButton = document.createElement('button');
    loadPreviousMsgButton.textContent = 'Load Previous Msg';
    loadPreviousMsgButton.id = 'premsg';

        while (content[0].firstChild) {
           content[0].removeChild(content[0].firstChild);
       }
       content[0].appendChild(loadPreviousMsgButton);
       const premsg = document.getElementById('premsg');
       premsg.addEventListener('click',loadpremsg);
       messages.forEach(item =>{
           const p = document.createElement('p');
           const details = `${item.name} : ${item.msg}`;
           p.textContent = details;
           content[0].appendChild(p);
        
       })
    })    

}

function loadpremsg(e){
    e.preventDefault();
     const button = document.getElementById("premsg");
     const content = document.getElementsByClassName('content');
     
    if (button.innerHTML === 'Load Previous Msg') {
        clearInterval(intervalId);
        button.innerHTML = "Hide";
        
         console.log('this is load');
    const storedData = localStorage.getItem('allmsgs');
    const allmsgs = JSON.parse(storedData);
    // const content = document.getElementsByClassName('content');
    console.log("all msgs is :",allmsgs);
    //  while (content[0].firstChild) {
    //        content[0].removeChild(content[0].firstChild);
    //    }
    const lastmsgid = allmsgs.length >=10 ? allmsgs.length-10 : allmsgs.length;
    for(let i=lastmsgid;i<=allmsgs.length;i++){
        content[0].removeChild(content[0].firstChild);
    }
    var newChild = document.createElement("div");
            
    allmsgs.forEach(item =>{
        const p = document.createElement('p');
        const details = `${item.name} : ${item.msg}`;
        p.textContent = details;
        newChild.appendChild(p);
    })
    var firstChild =  content[0].firstChild;

    // Insert the new element before the first child
     content[0].insertBefore(newChild, firstChild);
     content[0].insertBefore(button,firstChild)
    } else {
       
        button.innerHTML = "Load Previous Msg";
        intervalId = setInterval(getNewMsgs, 1000);
        var firstChild =  content[0].firstChild;

            // Insert the new element before the first child
             content[0].insertBefore(button, firstChild);
        
    }
   
}
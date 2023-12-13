
const send = document.getElementById('sendid');

send.addEventListener('click',sendMsg);

function sendMsg(e){
    e.preventDefault();
    const msg = document.getElementById('msgs').value;
    console.log("msg is ",msg);
    const token = localStorage.getItem('token');
    const obj = {
        msg:msg
    }
    document.getElementById('msgs').value = '';
axios.post('http://localhost:4000/msg',obj,{headers:{"Authorization":token}})
.then(res => {
    console.log(res.data.messages);
    const messages = res.data.messages;
    const content = document.getElementsByClassName('content');
    
        while (content[0].firstChild) {
           content[0].removeChild(content[0].firstChild);
       }
       messages.forEach(item =>{
           const p = document.createElement('p');
           const details = `${res.data.name} : ${item.msg}`;
           p.textContent = details;
           content[0].appendChild(p);
        
       })
    })
}
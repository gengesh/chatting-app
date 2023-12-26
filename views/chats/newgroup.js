// const chatboxLoad = require('./chats.js')
const newgroup = document.getElementById('newgroup');
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
// showGroupList();
const intervalId1 = setInterval(()=>{
  let recentGroupId = localStorage.getItem('recentGroupId');
  if(!recentGroupId){
      recentGroupId=0;
  }
  showGroupList(recentGroupId)}, 1000);
  newgroup.addEventListener("click", function () {
        popup.style.display = "block";
    });


closePopup.addEventListener("click", function () {
  popup.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target === popup) {
    popup.style.display = "none";
  }
});


function createDropdownOptions() {
  
  var dropdownContent = document.getElementById('dropdownContent');
  dropdownContent.innerHTML = '';
  const token = localStorage.getItem('token');
  axios.get(`http://localhost:4000/allusers`,{headers:{"Authorization":token}})
.then(res => {
    console.log(res.data.allusers);
    const users = res.data.allusers;
    users.forEach(function(member) {
      var label = document.createElement('label');
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = member.name;
      checkbox.id = member.id;
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(member.name));
      dropdownContent.appendChild(label);
    });
    })
    .catch(error => {
        console.error("Error fetching messages:", error);
    });
}

// Toggle dropdown visibility
function toggleDropdown() {
  var dropdownContent = document.getElementById('dropdownContent');
  dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
}

createDropdownOptions();

const creategroupButton = document.getElementById('creategroupButton');

creategroupButton.addEventListener("click",function(e) {
 e.preventDefault();
 const selectedMembers = [];
 const checkboxes = document.querySelectorAll('#dropdownContent input[type="checkbox"]:checked');
 const grpName = document.getElementById('grpname').value;
 checkboxes.forEach(function(checkbox) {
   selectedMembers.push(checkbox.id);
 });

console.log('members:',selectedMembers);
console.log('grpName:',grpName);

const token = localStorage.getItem('token');
const group = {
  groupname :grpName,
  members:selectedMembers
};
axios.post(`http://localhost:4000/group/add-group`,group,{headers:{"Authorization":token}})
.then(res => {
    const status = res.data.status;
    console.log("status:",status);
    const statusSpan = document.getElementById('status');
    statusSpan.textContent = status;
    var popup = document.getElementById('popup');
   popup.style.display = 'none';
})
})

async function showGroupList(recentGroupId){
  try{
    const token = localStorage.getItem('token');
   
  const parentElemGroup = document.getElementById('groupList');

  const groupResponse = await axios.get(`http://localhost:4000/group/get-groups?recentGroupId=${recentGroupId}`,{ headers: {"Authorization": token}})
  if(groupResponse.data.allGroups.length){

    console.log("groupssssssss:",groupResponse.data.allGroups)
  localStorage.setItem('recentGroupId',groupResponse.data.allGroups[groupResponse.data.allGroups.length-1].id);
  }
  for(let i=0; i< groupResponse.data.allGroups.length; i++) {
      groupBtn = document.createElement('input');
      groupBtn.type = "button";
      groupBtn.className = "newGroup";
      groupBtn.id = groupResponse.data.allGroups[i].id;
      groupBtn.value = groupResponse.data.allGroups[i].name;
      groupBtn.onclick =  (event) => {
        event.preventDefault();
          const groupId = event.target.id;
          groupBtnClicked(groupId);
      }
      var br = document.createElement('br');
      parentElemGroup.appendChild(groupBtn);
      parentElemGroup.appendChild(br);
  }
} catch(err) {
  console.error(err);
}
}

async function groupBtnClicked(groupId){
  localStorage.setItem('groupId',groupId);
  const content = document.getElementsByClassName('content');
  while (content[0].firstChild) {
           content[0].removeChild(content[0].firstChild);
       }
  await chatboxLoad();
  // const response = await axios.get(`http://localhost:4000/group/get-chat?groupId=${groupId}`, { headers: {"Authorization": token}})
  // const allChats = response.data.allChats;
}

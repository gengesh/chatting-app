
const newgroup = document.getElementById('newgroup');
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const closeAdmin = document.getElementById('closeAdmin');
const editMembers = document.getElementById('edit');
const closeMem = document.getElementById('closeMem');

closeAdmin.addEventListener('click', function () {
  const admin = document.getElementById('admin');
  admin.style.display = 'none';
})

closeMem.addEventListener('click', function () {
  const updateMem = document.getElementById('updateMem');
  updateMem.style.display = 'none';
})
// showGroupList();

editMembers.addEventListener('click',addOrRemoveMember);

function addOrRemoveMember(e){
  e.preventDefault();
  updateMem.style.display = 'block';

}
let recentGroupId = localStorage.getItem('recentGroupId');
if(!recentGroupId){
    recentGroupId=0;
}else{
  showGroupList(recentGroupId);
}

// const intervalId1 = setInterval(()=>{
//   let recentGroupId = localStorage.getItem('recentGroupId');
//   if(!recentGroupId){
//       recentGroupId=0;
//   }
//   showGroupList(recentGroupId)}, 1000);
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
function toggleDropdown1() {
  var dropdownContent = document.getElementById('dropdownContent1');
  dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
}
function toggleDropdown2() {
  var dropdownContent = document.getElementById('dropdownContent2');
  dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
}

createDropdownOptions();

const creategroupButton = document.getElementById('creategroupButton');
const updategroupButton = document.getElementById('updategroupButton');
const updategroupMem = document.getElementById('updategroupMem');

updategroupMem.addEventListener("click",function(e) {
  e.preventDefault();
  const selectedMembers = [];
  const checkboxes = document.querySelectorAll('#dropdownContent2 input[type="checkbox"]:checked');
  checkboxes.forEach(function(checkbox) {
    selectedMembers.push(checkbox.id);
  });
 
 console.log('members:',selectedMembers);
 const groupId = document.getElementById('grpname1').dataset.groupId;
 console.log("groupId:",groupId);
 const token = localStorage.getItem('token');
 console.log("selected members:",selectedMembers);
 const group = {
  groupId:groupId,
   members:selectedMembers
 };
 axios.post(`http://localhost:4000/group/update-members`,group,{headers:{"Authorization":token}})
 .then(res => {
      console.log("response is :",res);
      console.log("insertResult:",res.data.insertResult);
      console.log("deleteResult:",res.data.deleteResult);
     const updateMem = document.getElementById('updateMem');
     updateMem.style.display = 'none';
 })
 .catch((error) => {
  console.error("Error updating admin status:", error);
});
 })

updategroupButton.addEventListener("click",function(e) {
  e.preventDefault();
  const selectedMembers = [];
  const checkboxes = document.querySelectorAll('#dropdownContent1 input[type="checkbox"]:checked');
  checkboxes.forEach(function(checkbox) {
    selectedMembers.push(checkbox.id);
  });
 
 console.log('members:',selectedMembers);
 const groupId = document.getElementById('grpname1').dataset.groupId;
 console.log("groupId:",groupId);
 const token = localStorage.getItem('token');
 console.log("selected members:",selectedMembers);
 const group = {
  groupId,
   members:selectedMembers
 };
 axios.put(`http://localhost:4000/group/update-admin`,group,{headers:{"Authorization":token}})
 .then(res => {

     const admin = document.getElementById('admin');
     admin.style.display = 'none';
 })
 .catch((error) => {
  console.error("Error updating admin status:", error);
});
 })
 
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
   const newGroup = res.data.newGroup;
   console.log("newGroup is :",newGroup);
   const grpId = newGroup.id;
   const grpName = newGroup.name;
   socket.emit('group', { grpId, grpName });
})
})
socket.on('group', ({ grpId, grpName }) => {
  groupBtn = document.createElement('input');
  groupBtn.type = "button";
  groupBtn.className = "newGroup";
  groupBtn.id =  grpId;
  groupBtn.value = grpName;
  groupBtn.onclick =  (event) => {
    event.preventDefault();
      const groupId = event.target.id;
      groupBtnClicked(groupId);
  }
  const parentElemGroup = document.getElementById('groupList');
  var br = document.createElement('br');
  parentElemGroup.appendChild(groupBtn);
  parentElemGroup.appendChild(br);
})
async function showGroupList(recentGroupId){
  try{
    const token = localStorage.getItem('token');
   
  const parentElemGroup = document.getElementById('groupList');

  const groupResponse = await axios.get(`http://localhost:4000/group/get-groups?recentGroupId=${recentGroupId}`,{ headers: {"Authorization": token}})

  const name = groupResponse.data.userName;
  //  console.log("usrname  osofos:",name);
   socket.emit('new-user',name)


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
  const spanElement = document.getElementById('grpname1');
  spanElement.setAttribute('data-group-id', groupId);
  while (content[0].firstChild) {
           content[0].removeChild(content[0].firstChild);
       }
  await chatboxLoad();
  const token = localStorage.getItem('token');
  const adminResponse = await axios.get(`http://localhost:4000/group/isAdmin?groupId=${groupId}`, { headers: {"Authorization": token}})
  const edit =  document.getElementById('edit');
  const makeAdmin = document.getElementById('makeAdmin');
  const admin = document.getElementById('admin');
  const groupMembers = adminResponse.data.groupMembers;
  spanElement.innerHTML = adminResponse.data.groupName.name;
  console.log("groupMembers:",groupMembers);
  console.log("users:",adminResponse.data.users);
  const dropdownContent1 = document.getElementById('dropdownContent1');
  dropdownContent1.innerHTML = '';
  const dropdownContent2 = document.getElementById('dropdownContent2');
  dropdownContent2.innerHTML = '';
  console.log("this is check admin:",adminResponse.data);
       const users = adminResponse.data.users;

  users.forEach(function(member) {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = member.name;
    checkbox.id = member.id;
    // if (groupMembers.includes(member.id)) {
    //   checkbox.checked = true;
    // } else {
    //   checkbox.checked = false;
    // }
    let grpMem = groupMembers.some(memberObj => memberObj.admin.UserId === member.id);

if (grpMem) {
  checkbox.checked = true;
} else {
  checkbox.checked = false;
}

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode( member.name));
    dropdownContent2.appendChild(label);
  });


  groupMembers.forEach(function(member) {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = member.userData.name;
    checkbox.id = member.admin.id;
    checkbox.checked = member.admin.isAdmin;
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode( member.userData.name));
    dropdownContent1.appendChild(label);
  });
  if(adminResponse.data.isAdmin.isAdmin) {
  console.log("this is check admin process");
  edit.style.display = 'block';
  makeAdmin.style.display = 'block';
  makeAdmin.addEventListener('click', (event) => {
    event.preventDefault();
    console.log("this is admin");
    admin.style.display = 'block';
  });
  }  else {
    edit.style.display = 'none';
    makeAdmin.style.display = 'none';
  }
  
}

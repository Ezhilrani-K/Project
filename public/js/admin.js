window.onload = get();
window.onload = tasks();
window.onload = viewTask();
/**
 * get() used to relocate the html file when the user click logout
 */
function get() {
    document.getElementById("selectOption").addEventListener("change", printMsg);
    function printMsg() {
        window.location.href = "index.html"
    }
}
/**
 * userDetails() show all the users details
 */
function userDetails() {
    document.getElementById("myForm").style.display = "none";
    document.getElementById("userdetails").style.display = "block";
    document.getElementById("viewTask").style.display = "none";
    document.getElementById("shwTask").style.display = "none";
    let req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000/users", true);
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("x-admin-auth-token", localStorage.getItem("Token"));
    req.send();
    let content = "";
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                var data = JSON.parse(req.responseText);
                content += `<table id="tt" class="table table-hover">
			 <thead>
			   <tr>
				 <th scope="col" class="cen">Name</th>
				 <th scope="col" class="cen">Email</th>
				 <th scope="col" class="cen">Actions</th>
			   </tr>
			 </thead>
			 <tbody>`

                for (let i in data) {
                    content += `<tr>
    <td class="cen">${data[i].username}</td>
	<td class="cen">${data[i].email}</td>
	<td class="cen">
    <button id="btnStartBoot"  type="button" class="btn btn-secondary" data-toggle="modal" data-target="#formModal2" onclick=userAssign("${data[i].username}")>Assign a Task</button>
	<button class="btn btn-info" onclick=status("${data[i].username}") >Status of task</button>
	</td></tr>`
                }
                content += ` </tbody></table>`
                document.getElementById("userdetails").innerHTML = content;
                tasks();
            }
        }
    }


}
let assignuser;
/**
 * userAssign() used to show a dropdown menu for selecting a particular task to particular user
 * @param {String} username  represent the unique username
 */
function userAssign(username) {
    document.getElementById("assignForm").style.display = "block";
    assignuser = username;
    let dropDown = `<select id="selectedTask" class="dpmenu" type="dropdown">`;
    for (let i in data_json) {
        if (data_json[i].assignedTo == "Not Assigned") {
            dropDown += `<option value="${data_json[i].taskName}">${data_json[i].taskName}</option>`;
        }
    }
    document.getElementById("drop").innerHTML = dropDown + "</select>";
}
/**
 * assign() used to assign a particular task to particular user
 */
function assign() {
    let taskname = document.getElementById("selectedTask").value;
    let id;
    for (let i in data_json) {
        if (taskname == data_json[i].taskName) {
            id = data_json[i]._id;
        }
    }
    let xhr3 = new XMLHttpRequest();
    xhr3.open("PUT", "http://localhost:3000/assign-task/" + id, true);
    xhr3.setRequestHeader("content-type", "application/json");
    xhr3.setRequestHeader("x-admin-auth-token", localStorage.getItem("Token"));
    xhr3.send(JSON.stringify({ assignedTo: assignuser, notification: "1" }));
    xhr3.onreadystatechange = function () {
        if (xhr3.readyState == 4) {
            if (xhr3.status == 200) {
                document.getElementById("assignForm").style.display = "none";
                alert("Task is assigned Successfully");
                tasks();
                userDetails();
            }
        }
    }
}
let user;
/**
 * assigntask() used to show a form for assigning a task
 * @param {String} username represent the unique username
 */
function assignTask(username) {
    document.getElementById("myForm").style.display = "block";
    document.getElementById("status").style.display = "none";
    user = username;
    document.getElementById("userdetails").style.display = "none";
    document.getElementById("viewTask").style.display = "none";
    document.getElementById("shwTask").style.display = "none";

}
/**
 * closeForm() used to hide a form
 */
function closeForm() {
    document.getElementById("myForm").style.display = "none";
}
/**
 * addtask() used to add a new task in db
 */
function addTask() {
    let tskname = document.getElementById("tskname").value;
    let des = document.getElementById("des").value;
    let duration = document.getElementById("duration").value;
    let status = "Not started";
    event.preventDefault();
    document.getElementById("myForm").reset();
    let req = new XMLHttpRequest();
    console.log(data_json.length);
    let ans = data_json.length + 1;
    let tskId = "T00" + ans;
    console.log(tskId);
    let newobj = {
        taskName: tskname,
        description: des,
        assignedTo: "Not Assigned",
        duration: duration,
        taskId: tskId,
        status: status,
        notification: "0",
        comments: "No Comments",
    }
    req.open("POST", "http://localhost:3000/add-task", true);
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("x-admin-auth-token", localStorage.getItem("Token"));
    req.send(JSON.stringify(newobj));
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 201) {
                alert("Task added Successfully");
                tasks();

            }
        }

    }
}
/**
 * viewTask() displays all task
 */
function viewTask() {
    document.getElementById("status").style.display = "none";
    document.getElementById("myForm").style.display = "none";
    document.getElementById("userdetails").style.display = "none"
    document.getElementById("viewTask").style.display = "block";
    document.getElementById("shwTask").style.display = "none";
    let req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000/view-task", true);
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("x-admin-auth-token", localStorage.getItem("Token"));
    req.send();
    let content = "";
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                var data = JSON.parse(req.responseText);
                data_json = data;
                content += `<table id="tt"  class="table table-hover">
               <thead>
                 <tr>
                 <th scope="col" class="cen" >Task Id </th>
                   <th scope="col" class="cen" >Task Name <button type="button"  onclick=sortTaskName() id="sub" ><i class="fa fa-sort" aria-hidden="true"></i></button></th>
                   <th scope="col" class="cen" >Created At </th>
                   <th scope="col" class="cen">Assigned To </th>
                   <th scope="col" class="cen">Description </th>
                   <th scope="col" class="cen">Duration </th>
                   <th scope="col" class="cen">Status </th>
                   <th scope="col" class="cen">Comments </th>
                   <th scope="col" class="cen">Update </th>
                   <th scope="col" class="cen">Delete </th>
                </tr>
               </thead>
               <tbody>`;
                for (let i in data) {
                    var time = data[i].created_at.substring(0, 10);
                    if (data[i].status == "Not started") {
                        content += `<tr>
                    <td class="cen">${data[i].taskId}</td>
                <td class="cen">${data[i].taskName}</td>
                <td class="cen">${time}</td>
                <td class="cen">${data[i].assignedTo}</td>
                <td class="cen">${data[i].description}</td>
                <td class="cen">${data[i].duration}</td>
                <td class="cen" style="color:	#808080"  >${data[i].status}</td>
                    <td class="cen">${data[i].comments}</td>
                    <td class="cen">
                    <button id="btnStart"  type="button" class="btn btn-success" data-toggle="modal" data-target="#formModal1" onclick=UpdateItem("${data[i]._id}")><i class="fa fa-edit"></i></button></td>
                <td class="cen"> <button class='btn btn-danger' onclick='cancelFn("${data[i]._id}")' ><i class="fa fa-trash-o"></i></button></td>
                 </tr>`
                    }
                else if (data[i].status == "Completed") {
                        content += `<tr >
                    <td class="cen">${data[i].taskId}</td>
                <td class="cen">${data[i].taskName}</td>
                <td class="cen">${time}</td>
                <td class="cen">${data[i].assignedTo}</td>
                <td class="cen">${data[i].description}</td>
                <td class="cen">${data[i].duration}</td>
                <td class="cen" style="color: #228B22">${data[i].status}</td>
                    <td class="cen">${data[i].comments}</td>
                    <td class="cen">
                    <button id="btnStart"  type="button" class="btn btn-success" data-toggle="modal" data-target="#formModal1" onclick=UpdateItem("${data[i]._id}")><i class="fa fa-edit"></i></button></td>
                <td class="cen"> <button class='btn btn-danger' onclick='cancelFn("${data[i]._id}")' ><i class="fa fa-trash-o"></i></button></td></tr>`
                    }
                else {

                        content += `<tr>
                    <td class="cen">${data[i].taskId}</td>
                <td class="cen">${data[i].taskName}</td>
                <td class="cen">${time}</td>
                <td class="cen">${data[i].assignedTo}</td>
                <td class="cen">${data[i].description}</td>
                <td class="cen">${data[i].duration}</td>
                <td class="cen" style="color:#ffa500">${data[i].status}</td>
                    <td class="cen">${data[i].comments}</td>
                    <td class="cen">
                    <button id="btnStart"  type="button" class="btn btn-success" data-toggle="modal" data-target="#formModal1" onclick=UpdateItem("${data[i]._id}")><i class="fa fa-edit"></i></button></td>
    
                   <td class="cen"> <button class='btn btn-danger' onclick='cancelFn("${data[i]._id}")' ><i class="fa fa-trash-o"></i></button>
                       
                    </td>
                    
                    </tr>`
                    }
                 }
                }
            content += ` </tbody></table>`
            document.getElementById("userdetails").style.display = "none";
            document.getElementById("viewTask").innerHTML = content;
        }
    }
}

/**
 * tasks() used to get all tasks
 */
function tasks() {
    let req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000/view-task", true);
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("x-admin-auth-token", localStorage.getItem("Token"));
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                data_json = JSON.parse(req.responseText);
            }
        }
    }
}
let data_json;
/**
 * showTask() used to give a particular task by passing an username
 * @param {String} username represent the unique username
 */
function showTask(username) {
    document.getElementById("status").style.display = "none";
    document.getElementById("myForm").style.display = "none";
    document.getElementById("userdetails").style.display = "none";
    document.getElementById("shwTask").style.display = "block";
    let req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000/show-task/" + username, true);
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("x-admin-auth-token", localStorage.getItem("Token"));
    req.send();
    let data = "";
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                let responseData = JSON.parse(req.responseText);
                data_json = responseData;
                console.log(responseData);
                let assignedPerson;
                for (let i in responseData) {
                    assignedPerson = responseData[i].assignedTo;
                    data += `<div id="pan"><div class='card' id='read' style='width:22rem;border:2px solid black;background-color:aliceblue;display:inline-block'><h4>
					<center>${responseData[i].taskName}<center></h4><div class='card-body'
                id='details'>
                Description&nbsp:&nbsp${responseData[i].description}<br>
                Duration&nbsp:&nbsp${responseData[i].duration}<br>
                Status&nbsp:&nbsp${responseData[i].status}<br><br></div></div>`;
            }
                document.getElementById("userdetails").style.display = "none";
                document.getElementById("shwTask").innerHTML = `<div id="showUser">` + assignedPerson + "-Task Details</div>" + data;
            }
         }
    }
}
/**
 * This function remove a particular task by passing an id
 * @param {String} id represent the task Id
 */
function cancelFn(id) {
    if (confirm("Do you want to delete a task?") == true) {
        let req = new XMLHttpRequest();
        req.open("DELETE", "http://localhost:3000/cancel-task/" + id, true);
        req.setRequestHeader("Content-type", "application/json");
        req.setRequestHeader("x-admin-auth-token", localStorage.getItem("Token"));
        req.send();
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    viewTask();
                }
            }
        }
    }
}
let updateId;
/**
 * This function used to get a id for updating a task
 * @param {String} item 
 */
function UpdateItem(item) {
    document.getElementById("updateUserForm").style.display = 'block';
    updateId = item;
    for (let i in data_json) {
        if (item == (data_json[i]._id)) {
            USERID = item;
            document.getElementById("name3").value = data_json[i].taskName;
            document.getElementById("eventtype1").value = data_json[i].description;
            document.getElementById("troopname1").value = data_json[i].duration;
            break;
        }
    }

}
/**
 * used to sort a table for task field
 */
function sortTaskName() {
    let table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("tt");
    switching = true;
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[1];
        y = rows[i + 1].getElementsByTagName("TD")[1];
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }

//used to update a task
function newfunction() {
    var name = document.getElementById("name3").value;
    var event = document.getElementById("eventtype1").value;
    var troop = document.getElementById("troopname1").value;

    var xhr3 = new XMLHttpRequest();
    xhr3.open("PUT", "http://localhost:3000/task/" + updateId, true);
    xhr3.setRequestHeader("content-type", "application/json");
    xhr3.setRequestHeader("x-admin-auth-token", localStorage.getItem("Token"));
    xhr3.send(JSON.stringify({ taskName: name, description: event, duration: troop }));
    xhr3.onreadystatechange = function () {
        if (xhr3.readyState == 4) {
            if (xhr3.status == 200) {
                viewTask();
                document.getElementById("updateUserForm").style.display = 'none';
            }
          }
    }
}
//used to get task 
function status(username) {
    document.getElementById("status").style.display = "block";
    let req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000/show-task/" + username, true);
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("x-admin-auth-token", localStorage.getItem("Token"));
    req.send();
    let content = "";
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                var data = JSON.parse(req.responseText);
                content += ` <table id="statusTable" class="table table-hover">
               <thead>
                 <tr>
                   <th scope="col">Task Name</th>
                   <th scope="col">Status</th>
                   
                 </tr>
               </thead>
               <tbody>`;
                for (let i in data) {

                    if (data[i].status == "Not started") {
                        content += `<tr style="background-color: white">
                    
                <td>${data[i].taskName}</td>
                <td>${data[i].status}</td>
                
              </tr>`
                    }
                    else if (data[i].status == "Completed") {
                        content += `<tr style="background-color: rgb(62, 153, 62)">
                    
                <td>${data[i].taskName}</td>
                <td>${data[i].status}</td>
                
              </tr>`
                    }
                    else {
                        content += `<tr style="background-color:orange">
                    
                <td>${data[i].taskName}</td>
                <td>${data[i].status}</td>
                
              </tr>`
                }
                }
                document.getElementById("status").innerHTML = content;
                document.getElementById("myForm").style.display = "none";
            }

        }
    }
}
/**
 * used to search a particular task
 */
function searchTask() {
    let searchInput = document.getElementById("search").value;
    let id = [];
    if (!searchInput) {
        viewTask();
    }
    else {
        let req = new XMLHttpRequest();
        req.open("GET", "http://localhost:3000/view-task", true);
        req.setRequestHeader("Content-type", "application/json");
        req.setRequestHeader("x-admin-auth-token", localStorage.getItem("Token"));
        req.send();
        let content="";
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                   let data = JSON.parse(req.responseText);
                    for (let i in data) {
                        if (searchInput == data[i].taskName||searchInput==data[i].duration||searchInput==data[i].taskId ||searchInput==data[i].assignedTo ||searchInput==data[i].created_at ||searchInput==data[i].status) {
                            content += `<table id="tt"  class="table table-hover">
                            <thead>
                              <tr>
                              <th scope="col" class="cen" >Task Id</th>
                                <th scope="col" class="cen" >Task Name</th>
                                <th scope="col" class="cen" >Created At</th>
                                <th scope="col" class="cen">Assigned To</th>
                                <th scope="col" class="cen">Description</th>
                                <th scope="col" class="cen">Duration</th>
                                <th scope="col" class="cen">Status</th>
                                <th scope="col" class="cen">Comments</th>
                                <th scope="col" class="cen">Update </th>
                                <th scope="col" class="cen">Delete</th>
                             </tr>
                            </thead>
                            <tbody>`;
                            
                                 var time = data[i].created_at.substring(0, 10);
                                 if (data[i].status == "Not started") {
                                     content += `<tr>
                                 <td class="cen">${data[i].taskId}</td>
                             <td class="cen">${data[i].taskName}</td>
                             <td class="cen">${time}</td>
                             <td class="cen">${data[i].assignedTo}</td>
                             <td class="cen">${data[i].description}</td>
                             <td class="cen">${data[i].duration}</td>
                             <td class="cen" style="color:	#808080"  >${data[i].status}</td>
                                 <td class="cen">${data[i].comments}</td>
                                 <td class="cen">
                                 <button id="btnStart"  type="button" class="btn btn-success" data-toggle="modal" data-target="#formModal1" onclick=UpdateItem("${data[i]._id}")><i class="fa fa-edit"></i></button></td>
                             <td class="cen"> <button class='btn btn-danger' onclick='cancelFn("${data[i]._id}")' ><i class="fa fa-trash-o"></i></button></td>
                              </tr>`
                                 }
                             else if (data[i].status == "Completed") {
                                     content += `<tr >
                                 <td class="cen">${data[i].taskId}</td>
                             <td class="cen">${data[i].taskName}</td>
                             <td class="cen">${time}</td>
                             <td class="cen">${data[i].assignedTo}</td>
                             <td class="cen">${data[i].description}</td>
                             <td class="cen">${data[i].duration}</td>
                             <td class="cen" style="color: #228B22">${data[i].status}</td>
                                 <td class="cen">${data[i].comments}</td>
                                 <td class="cen">
                                 <button id="btnStart"  type="button" class="btn btn-success" data-toggle="modal" data-target="#formModal1" onclick=UpdateItem("${data[i]._id}")><i class="fa fa-edit"></i></button></td>
                             <td class="cen"> <button class='btn btn-danger' onclick='cancelFn("${data[i]._id}")' ><i class="fa fa-trash-o"></i></button></td></tr>`
                                 }
                             else {
             
                                     content += `<tr>
                                 <td class="cen">${data[i].taskId}</td>
                             <td class="cen">${data[i].taskName}</td>
                             <td class="cen">${time}</td>
                             <td class="cen">${data[i].assignedTo}</td>
                             <td class="cen">${data[i].description}</td>
                             <td class="cen">${data[i].duration}</td>
                             <td class="cen" style="color:#ffa500">${data[i].status}</td>
                                 <td class="cen">${data[i].comments}</td>
                                 <td class="cen">
                                 <button id="btnStart"  type="button" class="btn btn-success" data-toggle="modal" data-target="#formModal1" onclick=UpdateItem("${data[i]._id}")><i class="fa fa-edit"></i></button></td>
                 
                                <td class="cen"> <button class='btn btn-danger' onclick='cancelFn("${data[i]._id}")' ><i class="fa fa-trash-o"></i></button>
                                    
                                 </td>
                                 
                                 </tr>`
                                 }
                              }
                             }
                         content += ` </tbody></table>`
                            document.getElementById("userdetails").style.display = "none";
                            document.getElementById("viewTask").innerHTML = content;
                        }
                    }
                }
    }
}
window.onload = get();
window.onload = getTask();
/**
 * This function used to show the username in nav bar
 */
function get() {
   document.getElementById("selectOption").addEventListener("change", printMsg);
   let userName = localStorage.getItem('Username');
    document.getElementById("name").innerHTML = userName;
    function printMsg() {
        window.location.href = "index.html"
    }

}
var taskDetails;
/**
 *getTask() used to get all task
 */
function getTask() {
    let username = localStorage.getItem("Username");
    let req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000/task/" + username, true);
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("x-user-auth-token", localStorage.getItem("Token"));
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                let data = JSON.parse(req.responseText);
                taskDetails = data;
                display();

            }
        }
    }
}
/**
 * myTask() used to display the user html filr
 */
function myTask() {
    window.location.href = "user.html";
}
/**
 * display() used to display the task details
 */
function display() {
   let content = `<table id="table1" class="table">
    <thead>
      <tr>
        <th class="cen" scope="col">Task Name</th>
        <th  class="cen" scope="col">Status</th>
        <th  class="cen" scope="col">Update Status</th>
        <th class="cen" scope="col">Add Comments</th>
        <th class="cen" scope="col">View</th>
    </tr>
    </thead>
    <tbody>`;
    let whole = "";
    contentSelect = `<option selected>select status</option><option value="In progress">In progress</option>
    <option value="Completed">Completed</option>`

    if (taskDetails.length == 0) {
        document.getElementById("task").innerHTML = `<div id="notassign">Task is not assigned yet...</div>`;
    }

    else {
        for (let i in taskDetails) {
            contentName = `<tr><td class="cen">${taskDetails[i].taskName}</td>`;
            contentDrop= `<td class="cen"><select id="st${taskDetails[i]._id}" class="dpmenu" type="dropdown">`
            content4 = `</select> <button  onclick='changeStatus("${taskDetails[i]._id}")' style="border:none;background-color:transparent;"><i class="material-icons">update</i></button> </td>`;

            contentStatus= ` <td class="cen">${taskDetails[i].status} </td>`;

            contentButton = `
            <td class="cen"> <button data-toggle="modal" data-target="#formModal1" onclick='comment("${taskDetails[i]._id}")' style="border:none;background-color:transparent;"   ><i class="fa fa-comments-o" style="font-size:36px"></i></button> </td>
            <td class="cen"> <button  onclick='view("${taskDetails[i]._id}")' style="border:none;background-color:transparent;"   ><i class="fa fa-eye" style="font-size:20px;"></i></button> </td>
      </tr>`;

            whole += contentName + contentStatus + contentDrop+ contentSelect+content4 + contentButton;
 }

        function notify() {
            for (let i in taskDetails) {
                if (taskDetails[i].notification == "1") {
                    document.getElementById("notifi").style.display = "block";
                    let notifyMsg = `A new task is assigned for you`
                    notifyMsg += `<button type="submit" style="float:right;border:none;background-color:transparent;" onclick="window.location.href='user.html'">X</button>`;
                    document.getElementById("notifi").innerHTML = notifyMsg;
                    let xhr3 = new XMLHttpRequest();
                    xhr3.open("PUT", "http://localhost:3000/task-notifiy/" + taskDetails[i]._id, true);
                    xhr3.setRequestHeader("content-type", "application/json");
                    xhr3.setRequestHeader("x-user-auth-token", localStorage.getItem("Token"));
                    xhr3.send(JSON.stringify({ notification: "0" }));
                    xhr3.onreadystatechange = function () {
                        if (xhr3.readyState == 4) {
                            if (xhr3.status == 200) {

                            }
                        }
                    }
                }
            }
        }
        let total = content + whole + `</tbody></table>`;
        console.log(total);
        document.getElementById("task").innerHTML = total;
        setTimeout(notify, 500);
    }

}
let commentId;
/**
 * This function used to assign a taskId to a varaible 
 * @param {String} task represent the taskID
 */
function comment(task) {
    commentId = task;
}
/**
 * addComment() used to add
 */
function addComment() {
    let comment = document.getElementById("name3").value;
    document.getElementById("Comment").reset();
    let xhr3 = new XMLHttpRequest();
    xhr3.open("PUT", "http://localhost:3000/tasks/" + commentId, true);
    xhr3.setRequestHeader("content-type", "application/json");
    xhr3.setRequestHeader("x-user-auth-token", localStorage.getItem("Token"));
    xhr3.send(JSON.stringify({ comments: comment }));
    xhr3.onreadystatechange = function () {
        if (xhr3.readyState == 4) {
            if (xhr3.status == 200) {
                getTask();

            }
        }
    }

}
/**
 * This function used to change the status of a task
 * @param {String} userid represent the user id
 */
function changeStatus(userid) {
    let state = document.getElementById("st" + userid).value
    let xhr3 = new XMLHttpRequest();
    xhr3.open("PUT", "http://localhost:3000/tasks/" + userid, true);
    xhr3.setRequestHeader("content-type", "application/json");
    xhr3.setRequestHeader("x-user-auth-token", localStorage.getItem("Token"));
    xhr3.send(JSON.stringify({ status: state }));
    xhr3.onreadystatechange = function () {
        if (xhr3.readyState == 4) {
            if (xhr3.status == 200) {
                getTask();

            }
        }
    }
}
/**
 * This function used to view a particular task by passing an task id
 * @param {String} taskId represent the task Id
 */
function view(taskId) {
    document.getElementById("picture").style.display = "none";
    document.getElementById("taskDetails").style.display = "block";
    let req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000/tasks/" + taskId, true);
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("x-user-auth-token", localStorage.getItem("Token"));
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                let menu = JSON.parse(req.responseText);
                document.getElementById("tsk").innerHTML = menu[0].taskName;
                document.getElementById("des").innerHTML = menu[0].description;
                document.getElementById("dur").innerHTML = menu[0].duration;
                document.getElementById("sta").innerHTML = menu[0].comments;

            }
        }
    }

}
function closeForm() {
    document.getElementById("taskDetails").style.display = "none";
    document.getElementById("picture").style.display = "block";
}
/**
 * This function used to search a particular task and displays the same
 */
function searchTask() {
    let searchInput = document.getElementById("search").value;
    let state;
     if (searchInput == "completed" || searchInput == "Completed" || searchInput == "complete") {
        state = "Completed";
    }
    else if (searchInput == "in progress" || searchInput == "in Progress" || searchInput == " In Progress" || searchInput == "progress") {
        state = "In progress"
    }
    var name = [];
    let status = [];
    let id = [];
    if (!searchInput) {
        display();
    }
    else {
        for (let i in taskDetails) {
            if (state == taskDetails[i].status) {
                name.push(taskDetails[i].taskName);
                status.push(taskDetails[i].status);
                id.push(taskDetails[i]._id);

            }
        }
        let content = `<table id="table1" class="table">
    <thead>
      <tr>
        <th class="cen" scope="col">Task Name</th>
        <th  class="cen" scope="col">Status</th>
        <th  class="cen" scope="col">Update Status</th>
        <th class="cen" scope="col">View</th>
      </tr>
    </thead>
    <tbody>`;
        let whole = "";
        content3 = `<option selected>select status</option><option value="In progress">In progress</option>
    <option value="Completed">Completed</option>`
        if (name.length == 0) {
            document.getElementById("task").innerHTML = `<div id="notassign">Task is not found with the status ${searchInput}...</div>`;
        }
        else {
            for (let i in name) {
                contentName = `<tr><td class="cen">${name[i]}</td>`;
                contentDrop = `<td class="cen"><select id="st${id[i]}" class="dpmenu" type="dropdown">`
                content4 = `</select> <button  onclick='changeStatus("${id[i]}")' style="border:none;background-color:transparent;"><i class="fa fa-upload" style="font-size:25px;color:black"></i></button> </td>`;
                contentStatus= ` <td class="cen">${status[i]} </td>`;
                contentButton = `<td class="cen"> <button  onclick='view("${id[i]}")' style="border:none;background-color:transparent;"   ><i class="fa fa-eye" style="font-size:20px;"></i></button> </td></tr>`;
                whole += contentName+ contentStatus + contentDrop + content3 + content4 + contentButton;
            }
            let total = content + whole + `</tbody></table>`;
            document.getElementById("task").innerHTML = total;
        }
    }

}
/**
 * This function displays all task
 */
function displayTask() {
    document.getElementById("total").style.display = "none";
    let username = localStorage.getItem("Username");
    let req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000/task", true);
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("x-user-auth-token", localStorage.getItem("Token"));
    req.send();
    let content = "";
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                let data = JSON.parse(req.responseText);
                content += `<table id="tt" class="table table-hover">
                <thead>
                  <tr>
                    <th scope="col" class="cen" >Task Name</th>
                    <th scope="col" class="cen">Assigned To</th>
                    <th scope="col" class="cen">Description</th>
                    <th scope="col" class="cen">Duration</th>
                    <th scope="col" class="cen">Status</th>
                   </tr>
                </thead>
                <tbody>`;
                for (let i in data) {
                    if ((data[i].assignedTo != "Not Assigned") && (data[i].assignedTo != username)) {
                        content += `<tr>
                 <td class="cen">${data[i].taskName}</td>
                 <td class="cen">${data[i].assignedTo}</td>
                 <td class="cen">${data[i].description}</td>
                 <td class="cen">${data[i].duration}</td>
                 <td class="cen">${data[i].status}</td>
                </td>
               </tr>`
                    }
                }
                content += ` </tbody></table>`;
                document.getElementById("allTask").innerHTML = content;

            }
        }
    }
}
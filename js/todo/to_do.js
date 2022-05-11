$(document).ready(function () {
    // localStorage.removeItem("taskList");
    to_do.populateTask();
});

// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
        var div = this.parentElement;
        div.style.display = "none";
    }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function (ev) {
    if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
    }
}, false);

var to_do = {
    taskList: [],
    text: '',
    // Create a new list item when clicking on the "Add" button
    addTask: function () {
        var li = document.createElement("li");
        var inputValue = document.getElementById("txtInput").value;
        var t = document.createTextNode(inputValue);
        li.appendChild(t);
        if (inputValue === '') {
            swal({
                title: "Please input any task",
                text: "",
                icon: "warning",
                closeOnClickOutside: false
            });
        } else {
            document.getElementById("myUL").appendChild(li);
            document.getElementById("txtInput").value = "";
            var span = document.createElement("SPAN");
            var txt = document.createTextNode("\u00D7");
            span.className = "close";
            span.appendChild(txt);
            li.appendChild(span);
            this.addTaskToLocalStorage(inputValue);
        }


        for (i = 0; i < close.length; i++) {
            close[i].onclick = function () {
                var div = this.parentElement;
                div.style.display = "none";
                to_do.deleteTaskFromLocalStorage();
            }
        }
    },
    populateTask: function () {
        var task = localStorage.getItem("taskList");
        if (task != null) {
            var taskJson = task;
            this.taskList = JSON.parse(taskJson);
        } else {
            console.clear();
            console.log('No Task')
        }

        for (i = 0; i < this.taskList.length; i++) {
            var li = document.createElement("li");
            var t = document.createTextNode(this.taskList[i]);
            li.appendChild(t);
            document.getElementById("myUL").appendChild(li);
            var span = document.createElement("SPAN");
            var txt = document.createTextNode("\u00D7");
            span.className = "close";
            span.appendChild(txt);
            li.appendChild(span);
        }

        for (i = 0; i < close.length; i++) {
            close[i].onclick = function () {
                var div = this.parentElement;
                div.style.display = "none";
                to_do.deleteTaskFromLocalStorage();
            }
        }
    },
    addTaskToLocalStorage: function (inputValue) {
        this.taskList.push(inputValue);
        var taskJson = JSON.stringify(this.taskList);
        localStorage.setItem("taskList", taskJson);
        // swal({
        //     title: "Task added",
        //     text: "",
        //     icon: "success",
        //     closeOnClickOutside: false
        // });
    },
    deleteTaskFromLocalStorage: function () {
        if (to_do.taskList != null) {
            to_do.taskList.splice("5", 1);
            // to_do.taskList.length = 0;
            //delete to_do.taskList[i];
            //to_do.taskList.pop();
            // alert("deleted " + to_do.taskList[i]);
            var taskJson = JSON.stringify(to_do.taskList);
            localStorage.setItem("taskList", taskJson);
        }
        // swal({
        //     title: "Task deleted",
        //     text: "",
        //     icon: "success",
        //     closeOnClickOutside: false
        // });
    }
};

$(document).keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        to_do.addTask();
    }
});

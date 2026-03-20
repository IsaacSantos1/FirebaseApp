import { db } from "./firebase-config.js"
import { doc, collection, deleteDoc, updateDoc, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js"
import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

async function displayAllTasks() {
    try {
        const user = auth.currentUser;

if (!user) return;

const q = query(
    collection(db, "tasks"),
    where("userId", "==", user.uid)
);

const querySnapshot = await getDocs(q);

        const list = document.getElementById("list");
        if (list) {
            list.innerHTML = ""; 
            querySnapshot.forEach((doc) => {
                const task = doc.data();
                const li = document.createElement("li");
                li.id = doc.id; // Set the id of the <li> to the Firestore document ID
                li.textContent = `ID: ${doc.id} | ${task.name} - ${task.date} - ${task.status} (${task.priority})`; 

                // Set the background color based on the task status
                switch (task.status) {
                    case "not-started":
                        li.style.backgroundColor = "red";
                        break;
                    case "in-progress":
                        li.style.backgroundColor = "yellow";
                        break;
                    case "near-completion":
                        li.style.backgroundColor = "green";
                        break;
                    default:
                        li.style.backgroundColor = "transparent";
                }

                list.appendChild(li);
            });
        }
    } catch (error) {
        console.error("Error with Task Display", error);
    }
}

// 
const taskForm = document.querySelector(".taskCreate form");
taskForm.addEventListener("submit", async (e) => {
    e.preventDefault(); 

   const user = auth.currentUser;

if (!user) {
    alert("User not logged in");
    return;
}

const newTask = {
    name: document.getElementById("taskName").value,
    date: document.getElementById("ETC").value,
    status: document.getElementById("status").value,
    priority: document.getElementById("priority").value,
    userId: user.uid
};

    try {
        await addDoc(collection(db, "tasks"), newTask); 
        taskForm.reset(); 
        displayAllTasks(); 
        alert("Task Added!");
    } catch (error) {
        console.error("Error adding task:", error);
    }
});


onAuthStateChanged(auth, (user) => {
    if (user) {
        displayAllTasks();
    } else {
        window.location.href = "login.html";
    }
});

const taskList = document.getElementById('list');
const taskIDInput = document.getElementById('taskID');
const completeButton = document.getElementById('complete');
const progressButton = document.getElementById('progress');
const deleteButton = document.getElementById('delete');

completeButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const taskID = taskIDInput.value.trim();
    if (!taskID) {
        alert('Please enter a valid Task ID.');
        return;
    }

    try {
        const taskRef = doc(db, "tasks", taskID);
        await updateDoc(taskRef, { status: "complete" }); // Update Firestore
        displayAllTasks(); // Refresh the task list
        alert(`Task ${taskID} marked as complete.`);
    } catch (error) {
        console.error("Error updating task status:", error);
        alert("Task not found.");
    }
});

progressButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const taskID = taskIDInput.value.trim();
    if (!taskID) {
        alert('Please enter a valid Task ID.');
        return;
    }

    try {
        const taskRef = doc(db, "tasks", taskID);
        await updateDoc(taskRef, { status: "in-progress" }); // Update Firestore
        displayAllTasks(); // Refresh the task list
        alert(`Task ${taskID} marked as in progress.`);
    } catch (error) {
        console.error("Error updating task status:", error);
        alert("Task not found.");
    }
});

deleteButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const taskID = taskIDInput.value.trim();
    if (!taskID) {
        alert('Please enter a valid Task ID.');
        return;
    }

    try {
        const taskRef = doc(db, "tasks", taskID);
        await deleteDoc(taskRef); // Delete from Firestore
        displayAllTasks(); // Refresh the task list
        alert(`Task ${taskID} deleted.`);
    } catch (error) {
        console.error("Error deleting task:", error);
        alert("Task not found.");
    }
});

function updateTaskStatus(status) {
    const taskID = taskIDInput.value.trim();
    if (!taskID) {
        alert('Please enter a valid Task ID.');
        return;
    }

    const taskItem = document.getElementById(taskID);
    if (taskItem) {
        taskItem.dataset.status = status;
        taskItem.className = status; 
        taskItem.querySelector('.status').textContent = `Status: ${status}`;
        alert(`Task ${taskID} marked as ${status}.`);
    } else {
        alert('Task not found.');
    }
}

function deleteTask() {
    const taskID = taskIDInput.value.trim();
    if (!taskID) {
        alert('Please enter a valid Task ID.');
        return;
    }

    const taskItem = document.getElementById(taskID);
    if (taskItem) {
        taskList.removeChild(taskItem);
        alert(`Task ${taskID} deleted.`);
    } else {
        alert('Task not found.');
    }
}


function addTask(taskName, status = 'incomplete') {
    const taskID = `task-${Date.now()}`; 
    const taskItem = document.createElement('li');
    taskItem.id = taskID;
    taskItem.dataset.status = status;
    taskItem.className = status;
    taskItem.innerHTML = `
        <span class="name">${taskName}</span>
        <span class="status">Status: ${status}</span>
    `;
    taskList.appendChild(taskItem);
    return taskID;
}


addTask('Task 1', 'incomplete');
addTask('Task 2', 'in-progress');
addTask('Task 3', 'complete');

const signOutBtn = document.getElementById("signOutBtn");

if (signOutBtn) {
    signOutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            window.location.href = "login.html";
        } catch (error) {
            console.error("Sign out error:", error);
        }
    });
}
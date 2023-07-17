 //this library doesn't have types as default so had to run different installation commaned to tell TS the types.
 import { v4 as uuidV4 } from "uuid";

 // declaring cusotom Types, such as Task
type Task = {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}

// selecting our HMTL elements defining the type using built in <> of querySelector
// to tell typescript the specific type of these elements
const list = document.querySelector<HTMLUListElement>("#list");
const form = document.querySelector<HTMLFormElement>("#new-task-form");
const input = document.querySelector<HTMLInputElement>("#new-task-title");
// using the load tasks to set the tasks as either empty array or or previously saved tasks in local storage.
const tasks: Task[] = loadTasks()
//go through each task in the tasks array and create a list item from it.
tasks.forEach(addListItem)

// adding a submit event listener to the form using optional chaining to check if form is null
// necessary due to the fact we said the type could be form element or null so we need to handle
// the null condition
form?.addEventListener("submit", e => {
  //stop standard form behaviour of reloading page etc
  e.preventDefault()
  // makes sure the input has a value if haven't typed anything in yet just return or exit
  // using optional chaining to handle fact this input could be null
  if(input?.value == "" || input?.value == null) return

 // ensuring to declare the type of newTask as a Task type using "variable: Type" format
  const newTask: Task = {
    //uuid creates a random id for us
    id: uuidV4(),
    //don't need to use optional chaining to handle null of input now
    //as TS knows it can't be anymore based on if statement above
    title: input.value,
    completed: false,
    createdAt: new Date()
  }

  //add newTask to task array
  tasks.push(newTask)
  // new task created so save this to local storage
  saveTasks()
  //call the add list item with task that's created above
  addListItem(newTask)

  //clear the input so can add another task
  input.value = " "
})

// if you just pass parameter without giving it a type will give an error
function addListItem(task: Task){
  // creating a new task to show and all elements we will need for this
  const item  = document.createElement("li");
  const label  = document.createElement("label");
  const checkbox  = document.createElement("input");
  // add event listener to check if checkbox is ticked and update task completed accordingly
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked
    //call save tasks as there is a change to the tasks
    saveTasks()
  })

  checkbox.type = "checkbox"; // ensuring TS knows exact input type not just its an input
  checkbox.checked = task.completed;

  //combining all these thing into one
  label.append(checkbox, task.title);
  item.append(label);
  list?.append(item);
}

// saves the tasks array to local storage so it can be retrived later.
function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks))
}

// loads the tasks from local storage. As JSON parse could return any type need make sure
// we tell it this should return an array of our custom Task type
function loadTasks(): Task[] {
  // as the tasks type could be null or a string we need to handle the null type event
  const taskJSON = localStorage.getItem("TASKS");
  // if null then just return an empty array
  if (taskJSON == null) return [];
  return JSON.parse(taskJSON)
}

const entry = document.querySelector('#todo');

let projects = [];


class todo {
    constructor(title, description, dueDate, priority, notes, checklist) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.checklist = checklist;
    }
}

let project = class {
    constructor(name, description, color, list) {
        this.name = name;
        this.descrption = description;
        this.color = color;
        this.list = list;
    }
    

    addTodo(title, description, dueDate, priority, notes, checklist) {
        const newtodo = new todo(title, description, dueDate, priority, notes, checklist);
        addTodos(entry.value);
        this.list.push(newtodo);
    }

    static fromJSON(serializedJson) {
        return Object.assign(new project(), JSON.parse(serializedJson))
    }
}

function createProject(name, description, color, list) {
    let newProject = new project(name, description, color, list)
    return newProject;
}
if (storageAvailable('localStorage')) {
    getProjects(projects);
    projects.forEach(proj => {
        addProjectbtn(proj.name, proj);
    });
}

let currentProject = projects[0];
function changeProject(parent, name) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    //find project from projects array, use list of todos and create all the todos from it
}

function loadProject(project) {
    for (let i = 0; i < project.list.length; i++) {
        addTodos(project.list[i].title, project, project.list[i].checklist, i);
    }

}


function runDefault() {
    if (projects.length == 0) {
        let test = new todo ('test');
        let test2 = new todo ('work out');
        const defaults = createProject('Default', 'NA', 'blue', [test, test2]);
        projects.push(defaults);
        let currentProject = defaults;
        addProjects('defaults');
        addProjectbtn('Default', defaults);
        loadProject(defaults);
    }
}

runDefault();

const Todos = document.querySelector('.add');
Todos.addEventListener('click', () => {
    if (entry.value != '') {
        currentProject.addTodo(entry.value);
        entry.value = '';
        localStorage.setItem("projects", JSON.stringify(projects)); 
    }
});

entry.addEventListener('keyup', function(event)  {
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        Todos.click();
      }
})



function addTodos(text, project, completed, index) {
    let list = document.querySelector('.list');
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");


    const completeTodo = document.createElement("button");
    completeTodo.classList.add("complete");
    completeTodo.innerText = 'O';
    todoDiv.appendChild(completeTodo);


    const newTodo = document.createElement("li");
    newTodo.innerText = text;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    const deleteTodo = document.createElement("button");
    deleteTodo.classList.add("delete") 
    deleteTodo.innerText = 'X';
    todoDiv.appendChild(deleteTodo);

    

    completeTodo.addEventListener('click', () => {
        if (!newTodo.classList.contains('completed')) {
            newTodo.classList.add('completed');
            project.list[index].checklist = 'completed';
        } else {
            newTodo.classList.remove('completed');
            project.list[index].checklist = '';
        }
    })
    list.appendChild(todoDiv);

    deleteTodo.addEventListener('click', () => {
        todoDiv.parentNode.removeChild(todoDiv);
        project.list.splice(index, 1);
        localStorage.setItem("projects", JSON.stringify(projects)); 
    })

    if (project) {
        if (completed == 'completed') {
            newTodo.classList.add('completed');
        }
    }
}
let formContainer = document.querySelector('#form');

function createForm() {
    let form = document.createElement("form"); //create's the submission form
    createInput(form, 'Name');
    createInput(form, 'Description');
    createInput(form, 'Due Date');
    createInput(form, 'Completed');
    //form.style.display = 'none';

    const submit = document.createElement('button');
    submit.type = 'button';
    submit.classList.add('submit');
    submit.classList.add('button2');
    submit.innerHTML = 'Add';
    form.appendChild(submit);
    //submit.style.display = 'none';

    submit.addEventListener('click', () => {
        let name = document.getElementById("Name").value;
        let description = document.getElementById('Description').value;
        let dueDate = document.getElementById('Due Date').value;
        let completed = document.getElementById('Completed');
        let status;
        inputs.forEach((x) => {
            x.value = '';
        })
        if (completed.checked) {
            status = 'on';
        } else {
            status = 'off';
        }
        if (name == '' || description == '') {
            alert('Please fill out author and title.')
        } else {
            let newProject = createProject(name, description, dueDate, []);
            addProjectbtn(name, newProject);
            projects.push(newProject);
            localStorage.setItem("projects", JSON.stringify(projects)); 
            closeForm();
        }
    })

    const inputs = document.querySelectorAll('input');
}

function addProjects(text) {
    const btn = document.querySelector('.addProject');
    
    btn.addEventListener('click', () => {
        formContainer.style.display = 'flex';
    });
}

createForm();


function addProjectbtn(name, project) {
    let projectContainer = document.querySelector('.project-headers');
    const newProject = document.createElement("button");
    const list = document.querySelector('.list');
    newProject.classList.add('project')
    newProject.classList.add('button2');
    newProject.innerHTML = name;
    projectContainer.appendChild(newProject);
    newProject.addEventListener('click', () => {
        if (name != currentProject) {
            changeProject(list, name);
            currentProject = project;
            loadProject(project);
        }
    });
}






function createInput(f, labels) {
    let label = document.createElement("div");
    label.classList.add('label');
    label.innerHTML = labels;
    
    let input = document.createElement("input"); //input element, text
    input.setAttribute('type',"text");
    input.setAttribute('id', labels);
    if (labels == 'Completed') {
        label.innerHTML = 'Completed?';
        input.setAttribute('type', 'checkbox');
    }

    f.appendChild(label);
    f.appendChild(input);

    let display = document.getElementById('formcontent')
    //display.style.display = 'none';
    display.appendChild(f);
}

const close = document.querySelector('#close');

close.addEventListener('click', e => {
    closeForm();
});

function closeForm() {
    formContainer.style.display = 'none';
}


function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

function getProjects() {
    var newProject = JSON.parse(localStorage.getItem("projects"));
    if (newProject) {
        newProject.forEach(proj => {
            let cur = createProject(proj.name, proj.description, proj.color, proj.list);
            projects.push(cur);
        });
    }
}

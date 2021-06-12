let btnContainer = document.getElementById("task-list")

// Get all buttons with class="btn" inside the container
let btns = btnContainer.getElementsByClassName("align");

// Loop through the buttons and add the active class to the current/clicked button
for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
        let current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
    });
}

const form = document.querySelector("#itemform");
const inputItem = document.querySelector("#itemInput");

const itemsList = document.querySelector("#itemsList");
const filters = document.querySelectorAll(".align");

// create an empty item list
let todoItems = [];

// filter items
const getItemsFilter = function (type) {
    let filterItems = [];
    switch (type) {
        case "todo":
            filterItems = todoItems.filter((item) => !item.isDone);
            break;
        case "done":
            filterItems = todoItems.filter((item) => item.isDone);
            break;
        default:
            filterItems = todoItems;
    }
    getList(filterItems);
}

// delete item
const removeItem = function (item) {
    const removeIndex = todoItems.indexOf(item);
    todoItems.splice(removeIndex, 1);
}

// update item
const updateItem = function (currentItemIndex, value) {
    const newItem = todoItems[currentItemIndex];
    newItem.name = value;
    todoItems.splice(currentItemIndex, 1, newItem);
    setLocalStorage(todoItems);
}

const handleItem = function (itemData) {
    const items = document.querySelectorAll(".list-group-item");
    // console.log(items);
    items.forEach((item) => {
        if (
            item.querySelector(".title").getAttribute("data-time") == itemData.addedAt
        ) {
            //done
            item.querySelector("[data-done]").addEventListener('click', function (e) {
                e.preventDefault();
                // alert("Hi");
                const itemIndex = todoItems.indexOf(itemData);
                const currentItem = todoItems[itemIndex];
                // alert(currentItem.isDone);
                const currentClass = currentItem.isDone ?
                    "bi-check-circle-fill" :
                    "bi-check-circle";
                currentItem.isDone = currentItem.isDone ? false : true;
                todoItems.splice(itemIndex, 1, currentItem);
                setLocalStorage(todoItems);
                const iconClass = currentItem.isDone ?
                    "bi-check-circle-fill" :
                    "bi-check-circle";

                this.firstElementChild.classList.replace(currentClass, iconClass);
                const filterType = document.querySelector("#tabValue").value;
                getItemsFilter(filterType)
            });
            // edit
            item.querySelector("[data-edit]").addEventListener('click', function (e) {
                e.preventDefault();
                // alert('hi');
                inputItem.value = itemData.name;
                document.querySelector("#objIndex").value = todoItems.indexOf(itemData);
            });

            // delete
            item.querySelector("[data-delete]").addEventListener('click', function (e) {
                e.preventDefault();
                // alert('hi');
                if (confirm("Are you sure want to delete?")) {
                    itemsList.removeChild(item);
                    removeItem(item);
                    setLocalStorage(todoItems);
                    return todoItems.filter((item) => item != itemData);
                }

            });
        }
    })
}

const getList = function (todoItems) {
    itemsList.innerHTML = "";
    if (todoItems.length > 0) {
        todoItems.forEach((item) => {
            const iconClass = item.isDone ?
                "bi-check-circle-fill" :
                "bi-check-circle";

            itemsList.insertAdjacentHTML("beforeend", `<li class="list-group-item">
                            <span class="title" data-time = "${item.addedAt}">${item.name}</span>
                            
                            
                            <a href="#" data-done class="icons"><i class="bi ${iconClass}"></i></a>
                             <a href="#" data-edit class="icons"><i class="bi bi-pencil-square blue"></i></a>
                            <a href="#" data-delete class="icons"><i class="bi bi-x-circle red"></i></a>
                           
                           




                        </li>`);
            handleItem(item);
        });

    } else {
        itemsList.insertAdjacentHTML("beforeend", `<li class="list-group-item">
                            <span>No Reord Present</span>

                            




                        </li>`);
    }
}

// get LocalStorage from the page
const getLocalStorage = function () {
    const todoStorage = localStorage.getItem("todoItems");
    if (todoStorage === "undefined" || todoStorage === null) {
        todoItems = [];
    } else {
        todoItems = JSON.parse(todoStorage);
    }
    console.log("items", todoItems);
    getList(todoItems);
}


// set in Local Storage
const setLocalStorage = function (todoItems) {
    localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

document.addEventListener('DOMContentLoaded', () => {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const itemName = inputItem.value.trim();
        if (itemName.length === 0) {
            alert("Plear enter name.");
        } else {
            const currentItemIndex = document.querySelector("#objIndex").value;
            if (currentItemIndex) {
                // update
                updateItem(currentItemIndex, itemName);
                document.querySelector("#objIndex").value = "";
            } else {
                const itemObj = {
                    name: itemName,
                    isDone: false,
                    addedAt: new Date().getTime(),
                };
                todoItems.push(itemObj);
                setLocalStorage(todoItems);
            }
            getList(todoItems);


        }
        inputItem.value = "";
        console.log(itemName);
    })

    // filter tabs
    filters.forEach((tab) => {
        tab.addEventListener("click", function (e) {
            e.preventDefault();
            const tabType = this.getAttribute("data-type");
            // alert(tabType);
            getItemsFilter(tabType);
            document.querySelector("#tabValue").value = tabType;
        })
    })

    // Load items from Local storage before loading
    getLocalStorage();
})
readTodo();

async function readTodo(){
    const token = localStorage.getItem("x-access-token");
    if (!token) {
        return;
    }

    const config = {
        method: "get",
        url: url + "/todos",
        headers: {"x-access-token": token},
    };

    try {
        const res = await axios(config);
        console.log(res);
        if (res.data.code !== 200){
            alert(res.data.message);
            return false;
        }
        const todoDataSet = res.data.result;
        console.log(todoDataSet);

        for (let section in todoDataSet ){
            const sectionUl = document.querySelector(`#${section} ul`); 
            const arrayForEachSection = todoDataSet[section]; 

            let result = "";
            for (let todo of arrayForEachSection){
                let element = `
                    <li class="list-item" id=${todo.todoIdx}>
                        <div class="done-text-container">
                            <input type="checkbox" class="todo-done" ${todo.status==='C' ? "checked" : ""}/>
                            <p class="todo-text">
                                ${todo.contents}
                            </p>
                        </div>
                        <div class="update-delete-container">
                            <i class="todo-update fas fa-pencil-alt"></i>
                            <i class="todo-delete fas fa-trash-alt"></i>
                        </div>
                    </li>
                `;
                result += element;
            }

            sectionUl.innerHTML = result;
        }
    } catch(err) {
        console.log(err);
    }
}


// 일정 CUD
const matrixContainer = document.querySelector(".matrix-container");
matrixContainer.addEventListener("keypress", cudController);
matrixContainer.addEventListener("click", cudController);

function cudController(event){
    const token = localStorage.getItem("x-access-token");
    if (!token) {
        return;
    }

    const target = event.target;
    const targetTagName = target.tagName;
    const eventType = event.type;
    const key = event.key;

    // console.log(target, targetTagName, eventType, key);

    // Create이벤트처리
    if (targetTagName === "INPUT" && key === "Enter"){
        createTodo(event,token);
        return;
    }

    //Update이벤트 처리

    //checkBox이벤트 처리
    if( target.className === "todo-done" && eventType === "click") {
        updateTodoDone(event,token);
        return;
    }

    //Contents업데이트 처리
    const firstClassName = target.className.split(" ")[0];
    if(firstClassName === "todo-update" && eventType === "click"){
        updateTodoContents(event, token);
        return;
    }

    // Delete이벤트 처리
    if(firstClassName === "todo-delete" && eventType === "click"){
        deleteTodo(event, token);
        return;
    }
}

async function createTodo(event, token){
    const contents = event.target.value;
    const type = event.target.closest(".matrix-item").id;
    // console.log(contents, type);
    if (!contents) {
        alert("내용을 입력해 주세요");
        return false;
    }

    const config = {
        method: "post",
        url: url + "/todo",
        headers: {"x-access-token": token},
        data: {
            contents: contents,
            type: type,
        },
    };

    try {
        const res = await axios(config);
        if (res.data.code !== 200){
            alert(res.data.message);
            return false;
        }
 
        // DOM업데이트
        readTodo();
        event.target.value = "";
        return true;
    } catch(err){
        console.error(err);
        return false;
    }

}

async function updateTodoDone(event, token){
    const status = event.target.checked ? "C" : "A";
    const todoIdx = event.target.closest(".list-item").id;
    console.log(status, todoIdx);

    const config = {
        method: "patch",
        url: url + "/todo",
        headers: {"x-access-token": token},
        data: {
            todoIdx: todoIdx,
            status: status,
        },
    };

    try {
        const res = await axios(config);
        if (res.data.code !== 200){
            alert(res.data.message);
            return false;
        }
 
        // DOM업데이트
        readTodo();
        return true;
    } catch(err){
        console.error(err);
        return false;
    }

}

async function updateTodoContents(event, token){
    const contents = prompt("내용을 입력 해 주세요.");
    const todoIdx = event.target.closest(".list-item").id;

    const config = {
        method: "patch",
        url: url + "/todo",
        headers: {"x-access-token": token},
        data: {
            todoIdx: todoIdx,
            contents: contents,
        },
    };

    try {
        const res = await axios(config);
        if (res.data.code !== 200){
            alert(res.data.message);
            return false;
        }
 
        // DOM업데이트
        readTodo();
        return true;
    } catch(err){
        console.error(err);
        return false;
    }

}

async function deleteTodo(event, token){
    const isValidReq = confirm(
        "삭제하시겠습니까? 삭제 후에는 복구가 어렵습니다."
    );

    if(!isValidReq){
        return false;
    }
    const todoIdx = event.target.closest(".list-item").id;

    const config = {
        method: "delete",
        url: url + `/todo/${todoIdx}`,
        headers: {"x-access-token": token},
    };

    try {
        const res = await axios(config);
        if (res.data.code !== 200){
            alert(res.data.message);
            return false;
        }
 
        // DOM업데이트
        readTodo();
        return true;
    } catch(err){
        console.error(err);
        return false;
    }

}
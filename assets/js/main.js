const operatorBtns = document.querySelectorAll("[data-operator]");
const numberBtns = document.querySelectorAll("[data-num]");
const pointBtn = document.getElementById("float-btn");
const clearAllBtn = document.getElementById("clear-all");
const clearDigitBtn = document.getElementById("delete-btn");
const equalBtn = document.getElementById("equal-btn");
const total = document.getElementById("total");

const historicBtn = document.getElementById("historic-btn");
const historic = document.querySelector(".historic");
const historicDeleteBtn = document.getElementById("historic__delete-btn");
const historicList = document.querySelector(".historic__list");

var previousOperations = JSON.parse(localStorage.getItem("previousOperations")) || [];
previousOperations.forEach(item => { 
    createHistoricItem(item) 
});

const MAX_CHAR_LENGTH = 10;

var numbersList = [];
var operatorsList = [];
var result = null;

function removeLastDigit(element) {
    return element.slice(0, -1)
} 

function addNumber(numberBtn) {
    if(result) {
        if(total.innerHTML.at(-1) === operatorsList ) {
            numbersList[0] = result;
        }
        else {
            total.innerHTML = "";
        }
        result = null; 
    }

    const number = numberBtn.getAttribute("data-num");

    const cannotAdd = number === "." && numbersList[operatorsList.length].includes(".") || 
    total.innerHTML.length + 1 > MAX_CHAR_LENGTH;

    if(cannotAdd) {
        return 
    }
    if(total.innerHTML.at(-1) === "%") {
        operatorsList += "x";
        total.innerHTML += "x";
    }
    
    total.innerHTML += number;

    // Se existe um número nessa posição, concatena, se não, atribui
    if(numbersList[operatorsList.length]) {
        numbersList[operatorsList.length] += number;
    }
    else {
        numbersList[operatorsList.length] = number;
    } 
}

function addOperator(operatorBtn) {
    const operator = operatorBtn.getAttribute("data-operator");

    const canAdd = total.innerHTML != "" && !total.innerHTML.endsWith(operator);
    const lastDigit = total.innerHTML.at(-1);

    if(canAdd) {
        switch(lastDigit) {
            case "-":
            case "+":
                operatorsList = removeLastDigit(operatorsList) + operator;
                total.innerHTML = removeLastDigit(total.innerHTML) + operator;
                break

            case "÷":
            case "x":
                if(operator === "-") { 
                    operatorsList += operator;
                    total.innerHTML += operator;
                }
                else {
                    operatorsList = removeLastDigit(operatorsList) + operator; 
                    total.innerHTML = removeLastDigit(total.innerHTML) + operator;
                }
                break

            default:
                operatorsList += operator;
                total.innerHTML += operator;
        }
    }  
}

function clearAll() {
    numbersList = [];
    operatorsList = [];
    total.innerHTML = "";
}

function clearLastDigit() {
    const lastDigit = total.innerHTML.at(-1);
    total.innerHTML = removeLastDigit(total.innerHTML);

    switch(lastDigit) {
        case operatorsList.at(-1):
            operatorsList = removeLastDigit(operatorsList);
            break;

        case numbersList.at(-1).at(-1):
            numbersList[numbersList.length -1] = numbersList.at(-1).slice(0, -1);
            if(numbersList.at(-1) === "") {
                numbersList.pop();
            }
            break;

        default: if(result) { 
            result = removeLastDigit(toString(result)); 
        }
    }
}

function clearHistoric() {
    historicList.innerHTML = '';
    previousOperations = [];
    localStorage.setItem("previousOperations", JSON.stringify(previousOperations));
}

function generateResult() {
    if(operatorsList.length === 1 && numbersList[1] != "") {

        num1 = parseFloat(numbersList[0]);
        num2 = parseFloat(numbersList[1]);
        const operator = operatorsList;

        switch(operator) {
            case "+":
                result = num1 + num2;
                break
            case "-":
                result = num1 - num2;
                break
            case "x":
                result = num1 * num2;
                break
            case "÷":
                result = num1 / num2;
        }
    }
    else if (operatorsList.length > 1) {
        result = 
        eval(total.innerHTML.replace(/x/g, "*").replace(/÷/g, "/").replace(/%/g, "/100"));
    }

    if(result != null) {
        result = result.toString().includes(".") ? result.toFixed(3) : result;

        lastOperation = {
            'operation': total.innerHTML,
            'result': result
        };
        previousOperations.push(lastOperation);
        localStorage.setItem("previousOperations", JSON.stringify(previousOperations));
        createHistoricItem(lastOperation);

        //Limpa todas as variáveis para o uso na próxima operação
        clearAll();
        total.innerHTML = result;
    }
}

function createHistoricItem(lastOperation) {
    if(historicList.childElementCount + 1 > 10) { clearHistoric() };

    const item = document.createElement("li");
    item.classList.add("historic__item");

    const itemOperation = document.createElement("div");
    itemOperation.classList.add("historic__operation");
    itemOperation.innerHTML = lastOperation.operation;

    const itemResult = document.createElement("div");
    itemResult.classList.add("historic__operation");
    itemResult.innerHTML = lastOperation.result;

    item.appendChild(itemOperation);
    item.innerHTML += '=';
    item.appendChild(itemResult);
    historicList.appendChild(item);
}

for(let i = 0; i < numberBtns.length; i++) {
    numberBtns[i].addEventListener('click', function() { addNumber(numberBtns[i]) })
}
for(let i = 0; i < operatorBtns.length; i++) {
    operatorBtns[i].addEventListener('click', function() { addOperator(operatorBtns[i]) })
}
clearAllBtn.onclick = clearAll;
clearDigitBtn.onclick = clearLastDigit;
historicDeleteBtn.onclick = clearHistoric;
equalBtn.onclick = generateResult;

document.addEventListener('click', function(event) {
    if([historicBtn, historicBtn.firstElementChild].includes(event.target)){
        historic.classList.remove("hidden");
        return
    }
    else if(!historic.classList.contains("hidden") && !historic.contains(event.target)) {
        historic.classList.add("hidden");
    }
})
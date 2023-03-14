const operatorBtns = document.querySelectorAll("[data-operator]");
const numberBtns = document.querySelectorAll("[data-num]");
const pointBtn = document.getElementById("float-btn");
const clearAllBtn = document.getElementById("clear-all");
const clearDigitBtn = document.getElementById("delete-btn");
const equalBtn = document.getElementById("equal-btn");
const total = document.getElementById("total");

const MAX_CHAR_LENGTH = 10;

var numbersList = [];
var operatorsList = [];
var generatedResult = null;

function removeLastDigit(element) {
    return element.slice(0, -1)
} 

function addNumber(numberBtn) {
    if(generatedResult) {
        if(total.innerHTML[total.innerHTML.length - 1] === operatorsList ) {
            numbersList[0] = generatedResult;
        }
        else {
            total.innerHTML = "";
        }
        generatedResult = null; 
    }

    const number = numberBtn.getAttribute("data-num");

    const cannotAdd = number === "." && numbersList[operatorsList.length].includes(".") || 
    total.innerHTML.length + 1 > MAX_CHAR_LENGTH;

    if(cannotAdd) {
        return 
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
    const lastDigit = total.innerHTML[total.innerHTML.length - 1];

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
    const lastDigit = total.innerHTML[total.innerHTML.length - 1];
    const lastNumberOfList = numbersList[numbersList.length - 1];

    total.innerHTML = removeLastDigit(total.innerHTML);

    switch(lastDigit) {
        case operatorsList[operatorsList.length - 1]:
            operatorsList = removeLastDigit(operatorsList);
            break;

        case lastNumberOfList[lastNumberOfList.length - 1]:
            numbersList[numbersList.length - 1] = lastNumberOfList.slice(0, -1);
            if(numbersList[numbersList.length - 1] === "") {
                numbersList = numbersList.slice(0, -1);
            }
            break;

        default: if(generatedResult) { 
            generatedResult = removeLastDigit(toString(generatedResult)); 
        }
    }
}

function generateResult() {
    if(operatorsList.length === 1 && numbersList[1] != "") {

        num1 = parseFloat(numbersList[0]);
        num2 = parseFloat(numbersList[1]);
        const operator = operatorsList;

        switch(operator) {
            case "+":
                generatedResult = num1 + num2;
                break
            case "-":
                generatedResult = num1 - num2;
                break
            case "x":
                generatedResult = num1 * num2;
                break
            case "÷":
                generatedResult = num1 / num2;
        }
    }
    else if (operatorsList.length > 1) {
        generatedResult = eval(total.innerHTML.replace(/x/g, "*").replace(/÷/g, "/"));
    }

    if (generatedResult) {
        //Limpa todas as variáveis para o uso na próxima operação
        clearAll();
        generatedResult = generatedResult.toFixed(6);
        total.innerHTML = generatedResult;
    }
}

for(let i = 0; i < numberBtns.length; i++) {
    numberBtns[i].addEventListener('click', function() { addNumber(numberBtns[i]) })
}

for(let i = 0; i < operatorBtns.length; i++) {
    operatorBtns[i].addEventListener('click', function() { addOperator(operatorBtns[i]) })
}

clearAllBtn.onclick = clearAll;
clearDigitBtn.onclick = clearLastDigit;
equalBtn.onclick = generateResult;
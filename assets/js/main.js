const operatorsList = ["-", "+", "÷", "x", "%"]
const operatorBtns = document.querySelectorAll("[data-operator]");
const numberBtns = document.querySelectorAll("[data-num]");
const pointBtn = document.getElementById("float-btn");
const clearAllBtn = document.getElementById("clear-all");
const clearDigitBtn = document.getElementById("delete-btn");
const equalBtn = document.getElementById("equal-btn");
const total = document.getElementById("total");

var firstNumber = "";
var secondNumber = "";
var innerOperators = "";
var generatedResult = null;

function removeLastDigit(element) {
    return element.slice(0, -1)
} 

function addNumber(numberBtn) {
    const number = numberBtn.getAttribute("data-num");

    if(generatedResult) {
        if(total.innerHTML[total.innerHTML.length - 1] === innerOperators) {
            firstNumber = generatedResult;
        }
        else {
            total.innerHTML = "";
        }
        generatedResult = null; 
    }

    total.innerHTML += number;
     
    for(let i = 0; i < operatorsList.length; i++) {
        if(total.innerHTML.includes(operatorsList[i])) {
            secondNumber += number;

            return
        }
    }

    firstNumber += number;
}

function addOperator(operatorBtn) {
    const operator = operatorBtn.getAttribute("data-operator");
    const lastDigit = total.innerHTML[total.innerHTML.length - 1];

    const canAdd = total.innerHTML.length > 0 && !total.innerHTML.endsWith(operator);

    if(canAdd) {
        switch(lastDigit) {
            case "-":
            case "+":
                innerOperators = removeLastDigit(innerOperators) + operator;
                total.innerHTML = removeLastDigit(total.innerHTML) + operator;
                break

            case "÷":
            case "x":
                if(operator === "-") { 
                    innerOperators += operator;
                    total.innerHTML += operator;
                }
                else {
                    innerOperators = removeLastDigit(innerOperators) + operator; 
                    total.innerHTML = removeLastDigit(total.innerHTML) + operator;
                }
                break

            default:
                innerOperators += operator;
                total.innerHTML += operator;
        }
    }  
}

function addPoint() {
    lastDigit = total.innerHTML[total.innerHTML.length - 1];

    switch(lastDigit) {
        case secondNumber[secondNumber.length -1]:
            secondNumber += ".";
            break
        case firstNumber[firstNumber.length - 1]:
            firstNumber += ".";
            break
        case generatedResult[generatedResult.length - 1]:
            generatedResult += ".";
            break

        default: 
        if(total.innerHTML === "" || total.innerHTML.endsWith(innerOperators[innerOperators.length - 1])) {
            return
        } 
    }
    total.innerHTML += ".";
}

function clearAll() {
    firstNumber = "";
    secondNumber = "";
    innerOperators = "";
    total.innerHTML = "";
}

function clearLastDigit() {
    const lastDigit = total.innerHTML[total.innerHTML.length - 1];

    total.innerHTML = removeLastDigit(total.innerHTML);

    switch(lastDigit) {
        case innerOperators[innerOperators.length - 1]:
            innerOperators = removeLastDigit(innerOperators);
            break

        case secondNumber[secondNumber.length - 1]:
            secondNumber = removeLastDigit(secondNumber);
            break

        case firstNumber[firstNumber.length -1]:
            firstNumber = removeLastDigit(firstNumber);
            break
        
        default: if(generatedResult) { 
            generatedResult = removeLastDigit(`${generatedResult}`); 
        }
    }
}

function generateResult() {
    if(innerOperators.length === 1 && secondNumber != "") {

        num1 = parseFloat(firstNumber);
        num2 = parseFloat(secondNumber);
        const operator = innerOperators;

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
    else if (innerOperators.length > 1) {
        generatedResult = eval(total.innerHTML.replace(/x/g, "*").replace(/÷/g, "/"));
    }

    //Limpa todas as variáveis para o uso na próxima operação
    clearAll();
    total.innerHTML = generatedResult;
}

for(let i = 0; i < numberBtns.length; i++) {
    numberBtns[i].addEventListener('click', function() { addNumber(numberBtns[i]) })
}

for(let i = 0; i < operatorBtns.length; i++) {
    operatorBtns[i].addEventListener('click', function() { addOperator(operatorBtns[i]) })
}

clearAllBtn.onclick = clearAll;
clearDigitBtn.onclick = clearLastDigit;
pointBtn.onclick = addPoint;
equalBtn.onclick = generateResult;
const operatorsList = ["-", "+", "÷", "x", "%"]
const operatorBtns = document.querySelectorAll("[data-operator]");
const numberBtns = document.querySelectorAll("[data-num]");
const clearAllBtn = document.getElementById("clear-all");
const clearDigitBtn = document.getElementById("delete-btn");
const equalBtn = document.getElementById("equal-btn");
const total = document.getElementById("total");

var firstNumber = "";
var secondNumber = "";
var innerOperators = "";
var generatedResult = "";

function removeLastDigit(element) {
    return element.slice(0, -1)
} 

function addNumber(numberBtn) {
    const number = numberBtn.getAttribute("data-num");

    if(generatedResult != "") {
        generatedResult = "";
        total.innerHTML = number;
    }
    else{ total.innerHTML += number; }
     

    for(let i = 0; i < operatorsList.length; i++) {
        
        if(total.innerHTML.includes(operatorsList[i])) {
            secondNumber += number;

            return
        }
    }

    firstNumber += number 
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

function clearAll() {
    firstNumber = "";
    secondNumber = "";
    innerOperators = "";
    total.innerHTML = "";
}

function clearDigit() {
    const lastDigit = total.innerHTML[total.innerHTML.length - 1];

    total.innerHTML = total.innerHTML.slice(0, -1);

    if(innerOperators.endsWith(lastDigit)) {
        innerOperators = removeLastDigit(innerOperators);
        return
    } else if (secondNumber.endsWith(lastDigit)) {
        secondNumber = removeLastDigit(secondNumber);
        return
    }
    else if (firstNumber.endsWith(lastDigit)) { 
        firstNumber = removeLastDigit(firstNumber); 
    }  
}

function generateResult() {
    num1 = parseInt(firstNumber);
    num2 = parseInt(secondNumber);
    const operator = innerOperators;

    if(innerOperators.length === 1) {
        if(secondNumber === "") { 
            return
        }
        //Limpa todas as variáveis para o uso na próxima operação
        clearAll()

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
clearDigitBtn.onclick = clearDigit;
equalBtn.onclick = generateResult;
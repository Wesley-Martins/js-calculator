const operatorsList = ["-", "+", "÷", "x", "%"]
const operatorBtns = document.querySelectorAll("[data-operator]");
const numberBtns = document.querySelectorAll("[data-num]");
const clearAllBtn = document.getElementById("clear-all");
const clearDigitBtn = document.getElementById("delete-btn");
const total = document.getElementById("total");

var firstNumber = "";
var secondNumber = "";
var innerOperators = "";

function addNumber(numberBtn) {
    const number = numberBtn.getAttribute("data-num");
    total.innerHTML += number; 

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
                innerOperators = innerOperators.slice(0, -1) + operator;
                total.innerHTML = total.innerHTML.slice(0, -1) + operator;
                break

            case "÷":
            case "x":
                if(operator === "-") { 
                    innerOperators += operator;
                    total.innerHTML += operator;
                }
                else {
                    innerOperators = innerOperators.slice(0, -1) + operator; 
                    total.innerHTML = total.innerHTML.slice(0, -1) + operator;
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
        innerOperators = innerOperators.slice(0, -1);
        return
    } else if (secondNumber.endsWith(lastDigit)) {
        secondNumber = secondNumber.slice(0, -1);
        return
    }
    else if (firstNumber.endsWith(lastDigit)) { 
        firstNumber = firstNumber.slice(0, -1) 
    }  
}

/*function generateResult() {
    if(innerOperators.length === 1) {
        switch(innerOperators) {
            case "-"
        }
    }
}*/

for(let i = 0; i < numberBtns.length; i++) {
    numberBtns[i].addEventListener('click', function() { addNumber(numberBtns[i]) })
}

for(let i = 0; i < operatorBtns.length; i++) {
    operatorBtns[i].addEventListener('click', function() { addOperator(operatorBtns[i]) })
}

clearAllBtn.onclick = clearAll;
clearDigitBtn.onclick = clearDigit;
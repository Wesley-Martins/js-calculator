const operatorsList = ["-", "+", "/", "x", "%"]
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

    if(total.innerHTML.length > 0) {
        innerOperators += operator;

        total.innerHTML += operator;
    }  
}

function clearAll() {
    firstNumber = "";
    secondNumber = "";
    total.innerHTML = "";
}

// Arrumar essa função
function clearDigit() {
    firstNumber = firstNumber.slice(0, -1);
    total.innerHTML = total.innerHTML.slice(0, -1);
}

for(let i = 0; i < numberBtns.length; i++) {
    numberBtns[i].addEventListener('click', function() { addNumber(numberBtns[i]) })
}

for(let i = 0; i < operatorBtns.length; i++) {
    operatorBtns[i].addEventListener('click', function() { addOperator(operatorBtns[i]) })
}

clearAllBtn.onclick = clearAll;
clearDigitBtn.onclick = clearDigit;
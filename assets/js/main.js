import { previousOperations, createHistoricItem } from "./historic.js";
import { removeLastDigit } from "./utils.js"

const operatorBtns = document.querySelectorAll("[data-operator]");
const numberBtns = document.querySelectorAll("[data-num]");
const clearAllBtn = document.getElementById("clear-all");
const clearDigitBtn = document.getElementById("delete-btn");
const equalBtn = document.getElementById("equal-btn");
const total = document.getElementById("total");
const MAX_CHAR_LENGTH = 12;

var numbers = [];
var operators = [];
var result = null;

function addNumber(numberBtn) {
    if(result) {
        if(operators.length > 0 && total.innerHTML.at(-1) == operators.at(-1)) {
            numbers[0] = result;
        }
        else {
            total.innerHTML = "";
        }
        result = null; 
    }

    const number = numberBtn.getAttribute("data-num");

    const cannotAdd = number === "." && numbers[operators.length].includes(".") || 
    total.innerHTML.length + 1 > MAX_CHAR_LENGTH;

    if(cannotAdd) {
        return 
    }
    if(total.innerHTML.at(-1) == '%') {
        operators += "x";
        total.innerHTML += "x";
    }
    
    total.innerHTML += number;

    // Se existe um número nessa posição, concatena, se não, atribui
    if(numbers[operators.length]) {
        numbers[operators.length] += number;
    }
    else {
        numbers[operators.length] = number;
    } 
}

function addOperator(operatorBtn) {
    const lastDigit = total.innerHTML.at(-1);
    const operator = operatorBtn.getAttribute("data-operator");

    const cannotAdd = total.innerHTML === "" ||
    total.innerHTML.endsWith(operator) ||
    total.innerHTML.length + 1 > MAX_CHAR_LENGTH;
    
    if(cannotAdd) { return };
    switch(lastDigit) {
        case "-":
        case "+":
            operators = removeLastDigit(operators) + operator;
            total.innerHTML = removeLastDigit(total.innerHTML) + operator;
            break

        case "÷":
        case "x":
            if(operator === "-") { 
                operators += operator;
                total.innerHTML += operator;
            }
            else {
                operators = removeLastDigit(operators) + operator; 
                total.innerHTML = removeLastDigit(total.innerHTML) + operator;
            }
            break

        default:
            operators += operator;
            total.innerHTML += operator;
    }
}

function clearAll() {
    numbers = [];
    operators = [];
    total.innerHTML = "";
}

function clearLastDigit() {
    const lastDigit = total.innerHTML.at(-1);
    total.innerHTML = removeLastDigit(total.innerHTML);

    switch(true) {
        case operators.length > 0:
            if(operators.at(-1) == lastDigit) {
                operators = removeLastDigit(operators);
                break;    
            }

        case numbers.length > 0:
            if(numbers.at(-1).at(-1) == lastDigit) {
                numbers[numbers.length -1] = numbers.at(-1).slice(0, -1);
                if(numbers.at(-1) === "") {
                    numbers.pop();
                }
                break;
            }
        default:
            if(result) {
                result = removeLastDigit(result.toString());
            }
    }
}

function generateResult() {
    if(operators.length < 1) { return };
    if(operators.length === 1) {
        if(!numbers[1]) { return };
       const num1 = parseFloat(numbers[0]);
       const num2 = parseFloat(numbers[1]);
       const operator = operators;

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
    else if(operators.length > 1) {
        result = eval(total.innerHTML.replace(/x/g, "*").replace(/÷/g, "/").replace(/%/g, "/100"));
    }

    if(result != null) {
        result = result.toString();

        if(result.includes('.')) {
            result = parseFloat(result).toFixed(3);
            while(result.endsWith('0')) {
                result = removeLastDigit(result)
            }
        };

        const lastOperation = {
            'expression': total.innerHTML,
            'result': result
        };
        previousOperations.push(lastOperation);
        createHistoricItem(lastOperation);
        localStorage.setItem("previousOperations", JSON.stringify(previousOperations));

        //Limpa todas as variáveis para o uso na próxima operação
        clearAll();
        total.innerHTML = result;
    }
}

numberBtns.forEach(btn => {
    btn.addEventListener('click', ()=> { addNumber(btn) })
});
operatorBtns.forEach(btn => {
    btn.addEventListener('click', ()=> { addOperator(btn) })
});
clearAllBtn.onclick = clearAll;
clearDigitBtn.onclick = clearLastDigit;
equalBtn.onclick = generateResult;

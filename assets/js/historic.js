const historicOpenBtn = document.getElementById("historic-btn");
const historicDeleteBtn = document.getElementById("historic__delete-btn");
const historicList = document.querySelector(".historic__list");
const historic = document.querySelector(".historic");

//Se operações ja existem no localStorage, as atribui como valor, se não, Array vazio
export var previousOperations = JSON.parse(localStorage.getItem("previousOperations")) || [];
previousOperations.forEach(item => { 
    createHistoricItem(item) 
});

export function createHistoricItem(lastOperation) {
    if(historicList.childElementCount + 1 > 10) { clearHistoric() };

    historicList.innerHTML += `
        <li class="historic__item">
            <div class="historic__operation">${lastOperation.expression}</div>
            =
            <div class="historic__operation">${lastOperation.result}</div>
        </li>
    `
}

function clearHistoric() {
    historicList.innerHTML = '';
    previousOperations = [];
    localStorage.setItem("previousOperations", JSON.stringify(previousOperations));
}

historicDeleteBtn.onclick = clearHistoric;
historicOpenBtn.addEventListener('click', ()=> { historic.classList.remove("hidden") });

//Esconde o historic
document.addEventListener('click', function(event) {
    //Verifica se o click foi fora do historic e do btn que o abre
    const canHide = !historic.contains(event.target) &&
    ![historicOpenBtn, historicOpenBtn.firstElementChild].includes(event.target);

    if(canHide) {
       historic.classList.add("hidden")
    }    
})

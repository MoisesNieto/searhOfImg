const result = document.querySelector('#resultado');
const form = document.querySelector('#formulario');
const paginador = document.querySelector('#paginacion');

const recordForPage = 40;
let  totalPage;
let iteradorPage;
let pageActual = 1;

window.onload = ()=>{
    form.addEventListener('submit', checkForm);
}

function checkForm(e){
    e.preventDefault();
    const termi = document.querySelector('#termino').value;
    if (termi === ''){
        showAlert('Add a search term');
        return;
    }

    
    consultApi();
}

function showAlert(menssage){
    const alertError = document.querySelector('.error');
    if(!alertError){
        const Alert = document.createElement('p');
        Alert.textContent = menssage;
        Alert.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded','max-w-lg', 'mx-auto'
        , 'mt-6', 'text-center', 'error');
        form.appendChild(Alert);
        setTimeout(()=>{
            Alert.remove();
        }, 3000)
    } 
     
}
 async function consultApi(){
    const termino = document.querySelector('#termino').value;

    const ApiKey = '20709083-b43293daa0caf038dc07252d5';
    const url = `https://pixabay.com/api/?key=${ApiKey}&q=${termino}&per_page=${recordForPage}&page=${pageActual}`;

    try{
        const respuesta = await fetch(url);
        const date = await respuesta.json();
        totalPage = calculatePages(date.totalHits);
        showImg(date.hits);
    }catch(error){
        console.log(error);
    }
}

function showImg(resultImg){
    
    cleanHtml();

    resultImg.forEach( img => {

        const { previewURL, likes, views, largeImageURL} =  img;
        
        result.innerHTML += `
            <div class= "w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">
                    
                    <div class= "p-4">
                       
                    <p class="font-bold text-center">${likes}<span class= "font-ligth"> Like </span></p>
                    <p class="font-bold text-center">${views}<span class= "font-ligth"> times seen </span></p>
                        
                    <a  
                    class=" block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5"
                    href="${largeImageURL}" target="_blank" rel=" noopener noreferrer">
                            See Images 
                            
                        </a>
                    </div>
                </div>
            </div>
        `
              
    });
    while(paginador.firstChild){
        paginador.removeChild(paginador.firstChild)
    }

    toPrintPaginador();

}

function toPrintPaginador(){
    iteradorPage = createPaginador(totalPage);

    while (true) {
        const {value, done} = iteradorPage.next();
        if (done) return;

        const btn = document.createElement('a');
        btn.href='#';
        btn.dataset.pagina = value;
        btn.textContent = value;
        btn.classList.add('next', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded');
        
            btn.onclick =()=>{
                pageActual = value;
                consultApi();
            }
        paginador.appendChild(btn)

    }
}

function calculatePages(total){
    return parseInt(Math.ceil(total / recordForPage ));
}
//generator 
function *createPaginador(total){
    for (let i = 1 ; i  <= total; i++){
        yield i;
    }
}


function cleanHtml (){
    while(result.firstChild){
        result.removeChild(result.firstChild);
    }
}

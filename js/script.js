let mensagensAntigas = [{                         //lista para testar as mensagens iguais
    from: `Teste`,
    to: "Todos",
    text: `Teste1`,
    type: "message"
}, {
    from: `Teste`,
    to: "Todos",
    text: `Test2`,
    type: "message"
},{
    from: `Teste`,
    to: "Todos",
    text: `Teste3`,
    type: "message"
}];

let nomeUsuario = prompt('Qual seu nome?');

let obj = {
    name: `${nomeUsuario}` 
};


function novoParticipante () {
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", obj);
    promessa.then(entrou);
    promessa.catch(naoentrou);
    const idInterval = setInterval(checaStatus, 5000);        //checa o status a cada 5 sec
    const idInterval2 = setInterval(buscarMensagens, 3000);   //busca mensagens novas a cada 3 sec
    return idInterval, idInterval2;
}

const idInterval = novoParticipante();

function entrou(resposta){
    //buscarMensagens();
}

function naoentrou (erro){
    if (erro.response.status === 400){
     nomeUsuario = prompt("Nome já cadastrado, digite outro nome.");
        obj = {
            name: `${nomeUsuario}` 
        };
        novoParticipante();
    }
}

function checaStatus(){
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", obj);
    promessa.then(online);
    promessa.catch(offline);
}
function online (resposta){
    //buscarMensagens();
}
function offline(erro){             //desconecta o usuário offline e recarrega a página
    console.log(erro);
    clearInterval(idInterval);
    alert('Você foi desconectado por inatividade');
    window.location.reload();
}
function buscarMensagens(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promessa.then(mensagens);
    promessa.catch(mensagemfalhou);
}

function mensagens(resposta) {
    renderizaMensagens(resposta.data);   //renderiza as mensagens na tela
}

function mensagemfalhou (erro) {
    console.log(erro);
}

function renderizaMensagens(listaMensagens){     
    let ultimaMsg = listaMensagens[99];
    mensagensAntigas.push(ultimaMsg);
    let mensagemNova = document.querySelector('.tela-mensagens');
    if (msgIgual(mensagensAntigas[mensagensAntigas.length - 2],mensagensAntigas[mensagensAntigas.length - 1])){
    if (ultimaMsg.type === 'status'){
        mensagemNova.innerHTML += entraSai(ultimaMsg);
    }
    if (ultimaMsg.type === 'message'){
        if (ultimaMsg.to !== 'Todos'){ // filtra as mensagens privadas
            return;
        }
        mensagemNova.innerHTML += novaMsg(ultimaMsg);
    }
    mensagemNova.lastElementChild.scrollIntoView();
}
}
function entraSai (ultimaMsg) { //insere a mensagem de status
    return`<li class='inout'><span class='horas'>(${ultimaMsg.time})</span><span class='usuario'>&nbsp${ultimaMsg.from}</span><p>&nbsp${ultimaMsg.text}</p></li>`;
}
function novaMsg (ultimaMsg) { //insere a mensagem normal
    return `<li class='msg'><span class='horas'>(${ultimaMsg.time})</span><span class='usuario'>&nbsp${ultimaMsg.from}</span>&nbsppara<span class='usuario'>&nbsp${ultimaMsg.to}:</span><p>&nbsp${ultimaMsg.text}</p></li>`;
}

function enviaMsg() {
    let texto = document.getElementById('caixa-texto').value; //envia as mensagens ao clicar no
    let msg = {                                               //icone do avião de papel
            from: `${nomeUsuario}`,
            to: "Todos",
            text: `${texto}`,
            type: "message"
        };
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", msg);
    promessa.then(chegouMensagem);
    promessa.catch(naoChegouMensagem);
}

function chegouMensagem (sent) {
    console.log(sent);
    buscarMensagens();
}

function naoChegouMensagem (erro) {
    console.log(erro);
}

function msgIgual (msg1, msg2){         //verifica se as mensagens recebidas a cada 3 segundos são novas
    let verificação1 = msg1.text !== msg2.text;
    let verificação2 = msg1.from !== msg2.from;
    let verificação3 = msg1.type !== msg2.type;
    let verificação = verificação1 || verificação2 || verificação3;
    return verificação; 
}
//Adiciona o menu "Programa" ao instalar
function onInstall(e) {
  onOpen(e);
}

//Adiciona o menu "Programa" ao abrir
function onOpen(e) {
  var spreadSheet = SpreadsheetApp.getActive();
  var menuItems = [{name: "Executar", functionName: "run"},
                   {name: "Zerar Registradores", functionName: "reset"}];
  spreadSheet.addMenu("Programa", menuItems);
}

//Celulas da máquina virtual
//ip: Instruction Pointer
//memoria: Todas as 100 células da memória da máqiuna virtual
//regErro: O registrador que contém o valor de erro (0 se n ão ocorreu nenhum erro)
//registradores: Todos os registradores da máquina virtual
var ip = SpreadsheetApp.getActiveSheet().getRange(2, 7, 1, 1);
var sp = SpreadsheetApp.getActiveSheet().getRange(2, 8, 1, 1);
var memoria = SpreadsheetApp.getActiveSheet().getRange(4, 1, 10, 10);
var out = SpreadsheetApp.getActive().getActiveSheet().getRange(2, 9, 1, 1);
var regErro = SpreadsheetApp.getActiveSheet().getRange(2, 10, 1, 1);
var registradores = SpreadsheetApp.getActiveSheet().getRange(2, 1, 1, 10);

//Executa o código
function run() {
  var spreadSheet = SpreadsheetApp.getActive();
  var sheet = spreadSheet.getActiveSheet();
  do {
    var instAddress = ip.getValue();
    var range = acessaMem(instAddress);
    mudarFundo(range, "#dddddd");
    var instrucao = range.getValue();
    if (comando(sheet, instrucao)) {
      mudarFundo(memoria, "#ffffff");
      ip.setValue((ip.getValue() + 1) % 100);
    } else {
      mudarFundo(range, "#ff0000");
      break;
    }
  } while (instrucao != "halt");
}

function acessaMem(endereco) {
  return SpreadsheetApp.getActiveSheet().getRange(linhaMem(endereco), colunaMem(endereco), 1, 1);
}

function linhaMem(endereco) {
  return Math.floor((endereco % 100) / 10) + 4;
}

function colunaMem(endereco) {
  return (endereco % 10) + 1;
}

//Muda a cor de fundo de uma celula ou conjunto de células
function mudarFundo(range, fundo) {
  range.setBackground(fundo);
  while (range.getBackground() != fundo) {}
}

//Checa qual é o comando e o executa
function comando(sheet, instrucao) {
  var instrucoes = instrucao.split(" ");
  
  //Instruções de operações aritméticas
  if (instrucoes[0] == "add") insere(sheet, instrucoes[1], valor(sheet, instrucoes[2]) + valor(sheet, instrucoes[3]));
  else if (instrucoes[0] == "sub") insere(sheet, instrucoes[1], valor(sheet, instrucoes[2]) - valor(sheet, instrucoes[3]));
  else if (instrucoes[0] == "mult") insere(sheet, instrucoes[1], valor(sheet, instrucoes[2]) * valor(sheet, instrucoes[3]));
  else if (instrucoes[0] == "div") insere(sheet, instrucoes[1], Math.floor(valor(sheet, instrucoes[2]) / valor(sheet, instrucoes[3])));
  else if (instrucoes[0] == "mod") insere(sheet, instrucoes[1], valor(sheet, instrucoes[2]) % valor(sheet, instrucoes[3]));
  
  //Operações baixo nível (slides)
  else if (instrucoes[0] == "sll") insere(sheet, instrucoes[1], slideLeft(valor(sheet, instrucoes[2]), valor(sheet, instrucoes[3])));
  else if (instrucoes[0] == "slr") insere(sheet, instrucoes[1], slideRight(valor(sheet, instrucoes[2]), valor(sheet, instrucoes[3])));
  
  //Atribuição de valor a um registrador
  else if (instrucoes[0] == "atr") insere(sheet, instrucoes[1], valor(sheet, instrucoes[2]));
  
  //Instrucoes de memória
  else if (instrucoes[0] == "ld") insere(sheet, instrucoes[1], acessaMem(valor(sheet, instrucoes[2])).getValue());
  else if (instrucoes[0] == "st") store(acessaMem(valor(sheet, instrucoes[1])), valor(sheet, instrucoes[2]));
    
  //Jump e Branches
  else if (instrucoes[0] == "jump") jump(sheet, instrucoes[1]);
  else if (instrucoes[0] == "blt") {if (valor(sheet, instrucoes[1]) < valor(sheet, instrucoes[2])) jump(sheet, instrucoes[3])}
  else if (instrucoes[0] == "blet") {if (valor(sheet, instrucoes[1]) <= valor(sheet, instrucoes[2])) jump(sheet, instrucoes[3])}
  else if (instrucoes[0] == "bgt") {if (valor(sheet, instrucoes[1]) > valor(sheet, instrucoes[2])) jump(sheet, instrucoes[3])}
  else if (instrucoes[0] == "bget") {if (valor(sheet, instrucoes[1]) >= valor(sheet, instrucoes[2])) jump(sheet, instrucoes[3])}
  else if (instrucoes[0] == "beq") {if (valor(sheet, instrucoes[1]) == valor(sheet, instrucoes[2])) jump(sheet, instrucoes[3])}
  else if (instrucoes[0] == "bne") {if (valor(sheet, instrucoes[1]) != valor(sheet, instrucoes[2])) jump(sheet, instrucoes[3])}
  
  //Saida do programa
  else if (instrucoes[0] == "out") out.setValue(valor(sheet, instrucoes[1]));
  
  //Casos que sempre retornam um valor para erro, seja de sucesso ou não
  else if (instrucao == "halt") erro(0);
  else if (instrucao != "") erro("notIns");
  
  //Se surgiu algum erro
  if (regErro.getValue() != 0) return false;
  return true;
}

function store(memoria, valor) {
  memoria.setValue(valor);
}

//Salta para o endereco especificado
function jump(sheet, entrada) {
  ip.setValue((valor(sheet, entrada) - 1) % 100);
}

//Insere um valor de erro no registrador de erro
function erro(msg) {
  regErro.setValue(msg);
}

//Variáveis usadas para checar se as entradas contém registradores ou valores válidos
zero = "0".charCodeAt(0);
sete = "7".charCodeAt(0);
nove = "9".charCodeAt(0);

//Insere um valor no registrador selecionado
function insere(sheet, local, valor) {
  if (registrador(local)) {
    var reg = Number(local.charCodeAt(1) - zero);
    sheet.getRange(2, reg, 1, 1).setValue(valor);
  } else if (local == "sp") {
    sp.setValue(valor);
  } else {
    erro("notReg");
  }
}

//Pega um valor de um registrador ou de um número
function valor(sheet, entrada) {
  var valor = entrada.toString();
  if (numero(valor)) {
    return Number(valor);
  } else if (registrador(valor)) {
    return Number(sheet.getRange(2, Number(valor.charAt(1))).getValue());
  } else if (valor == "sp") {
    return Number(sp.getValue());
  } else {
    erro("notVal");
    return 0;
  }
}

//Checa se uma string é um número
function numero(valor) {
  var i;
  for (i = 0; i < valor.length; i++) {
    var letra = valor.charCodeAt(i);
    if (letra < zero || letra > nove) return false;
  }
  return true;
}

//Checa se uma string representa um registrador
function registrador(valor) {
  if (valor.length != 2) return false;
  if (valor.charAt(0) != 'r') return false;
  if (valor.charCodeAt(1) <= zero || valor.charCodeAt(1) >= sete) return false;
  return true;
}

function memoria(valor) {}

//Aplica o operador << a um número
function slideLeft(a, b) {
  Math.floor(a * Math.pow(2, b));
}

//Aplica o operador >> a um número
function slideRight(a, b) {
  Math.floor(a / Math.pow(2, b));
}

//Zera todos os registradores
function reset() {
  registradores.setValue(0);
  sp.setValue(99);
}

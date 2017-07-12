# Maquina-Virtual
Máquina virtual implementada no Apps Script do Google.
Inspirada no projeto de Brian Steffens: https://briansteffens.github.io/2017/07/03/google-sheets-virtual-machine.html (não houve cópia de código)

*Registradores:*
* _R1_ a _R6_: Registradores para operações
* _IP_: Guarda o endereço da instrução atual
* _SP_: Stack Poniter, pode ser usado nas operações junto com os registradores r1 a r6
* _OUT_: Registrador de saída
* _ERR_: Registrador de erro

Instruções aritméticas:
* _atr rA B_: Insere B em rA
* _add rA B C_: Insere B + C em rA
* _sub rA B C_: Insere B - C em rA
* _mult rA B C_: Insere B * C em rA
* _div rA B C_: Insere B / C em rA
* _mod rA B C_: Insere B % C em rA
* _sll rA B C_: Insere B << C em rA
* _slr rA B C_: Insere B >> C em rA

Instruções de memória:
* _ld rA B_: Insere o valor do endereço de memória B em A
* _st A B_: Insere B no endereço de memória A

Instruções de desvio:
* _jump A_: Desvia para a instrução no endereço A
* _blt A B C_: Se A < B desvia para C
* _blet A B C_: Se A <= B desvia para C
* _bgt A B C_: Se A > B desvia para C
* _bget A B C_: Se A >= B desvia para C
* _beq A B C_: Se A == B desvia para C
* _bne A B C_: Se A != B desvia para C

Para finalizar:
* _out A_: Coloca A no registrador OUT
* _halt_: Termina a execução do programa

Valores de erro da máquina:
* _0_: Se estiver tudo certo, aparece isso
* _notReg_: Se em alguma instrução não foi colocado um registrador onde deveria haver um
* _notVal_: Se há um valor inválido onde deveria haver um

Além dos valores, a instrução onde o erro ocorreu fica destacada.

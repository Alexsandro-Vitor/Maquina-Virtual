# Maquina-Virtual
Máquina virtual implementada no Apps Script do Google.
Inspirada no projeto de Brian Steffens: https://briansteffens.github.io/2017/07/03/google-sheets-virtual-machine.html (não houve cópia de código)

*Registradores:*
* _R1_ a _R6_: Registradores para operações
* _IP_: Guarda o endereço da instrução atual
* _SP_: Stack Poniter (ainda está sem uso)
* _OUT_: Registrador de saída
* _ERR_: Registrador de erro

Instruções aritméticas implementadas:
* _atr rA B_: Insere B em rA
* _add rA B C_: Insere B + C em rA
* _sub rA B C_: Insere B - C em rA
* _mult rA B C_: Insere B * C em rA
* _div rA B C_: Insere B / C em rA
* _mod rA B C_: Insere B % C em rA
* _sll rA B C_: Insere B << C em rA
* _slr rA B C_: Insere B >> C em rA

Instruções de desvio implementadas:
* _jump A_: Desvia para a instrução no endereço A
* _blt A B C_: Se A < B desvia para C
* _blet A B C_: Se A <= B desvia para C
* _bgt A B C_: Se A > B desvia para C
* _bget A B C_: Se A >= B desvia para C
* _beq A B C_: Se A == B desvia para C
* _bne A B C_: Se A != B desvia para C

Para finalizar:
* _out A_: Coloca A no registrador OUT
* _halt_: Termina a execução

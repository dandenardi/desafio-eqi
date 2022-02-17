Projeto desenvolvido como parte do processo seletivo para desenvolvedor front-end Jr. da EQI. 

Para que o projeto funcione é necessário:

Ter a fake API rodando:
  * Passo 1 - clonar ou realizar download do seguinte repositório: https://github.com/eqi-investimentos/desafio-fake-api
  * Passo2 - acessar o diretório onde foi realizada a clonagem/download. 
  * Passo 3 - executar npm install (apenas na primeira vez)
  * Passo 4 - Executar npx json-server db.json (a cada nova inicialização). 
  
  A API fica localizada em http://localhost:3000.
  
  Em seguida é preciso ter o presente projeto instalado na máquina local:
  
  * Passo 1 - clonar ou realizar download deste repositório (https://github.com/dandenardi/desafio-eqi)
  * Passo 2 - de dentro do diretório onde foi clonado/feito download do repositório, executar npm install
  * Passo 3 - executar o comando npm start

O local do projeto foi alterado para http://localhost:3000, para evitar conflito com a API.

Qual a função deste projeto?

Trata-se de uma aplicação web que consulta, com base em dados digitados pelo usuário, uma base de dados. Ela é capaz de receber dados de uma API externa e gerar um
relatório, contendo informações e gráficos, sobre os rendimentos de determinada aplicação financeira.

Futuramente, poderá também registrar dados, fazer previsões e retornar em tempo real estimativas para melhor tomada de decisão.

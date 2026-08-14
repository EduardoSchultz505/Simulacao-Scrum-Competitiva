# PAINEL DE AVALIAÇÃO — SIMULAÇÃO SCRUM COMPETITIVA

## COMO USAR

### Requisitos
- Node.js
- npm
### Instalação
1. Clone ou baixe este repositório para sua máquina.
2. Abra o terminal na pasta do projeto.
3. Instale as dependências:
   ```bash
npm install
```

4. Execute o projeto:
   ```bash
npm run dev
```

Após executar o comando, o terminal exibirá o endereço local para acessar o sistema.


## ESTRUTURA DO PROJETO
src/
├── components/     -> componentes reutilizáveis da aplicação
├── pages/          -> telas/abas do sistema
├── data/           -> dados utilizados pela aplicação
├── assets/         -> imagens fornecidas para o projeto
├── App.jsx         -> componente principal
└── main.jsx        -> ponto de entrada da aplicação
public/             -> arquivos públicos e imagens
package.json        -> dependências e scripts do projeto


## FUNCIONALIDADES
O sistema possui as seguintes áreas:

Configuração
Alunos
Escalação
Avaliação de papéis
Resultado Final

Os dados dos alunos são carregados para a aplicação e podem ser utilizados para preencher as avaliações e demais informações do sistema.

## SALVAR E CARREGAR DADOS
Os dados da aplicação são armazenados no navegador utilizando o localStorage.
O sistema possui duas formas de salvamento:

Salvamento automático:
As alterações relevantes realizadas no sistema são salvas automaticamente no localStorage, evitando a perda dos dados durante a utilização.

Salvamento manual:
Também existe um botão para salvar os dados manualmente.

Os dados salvos podem ser recuperados quando o sistema for aberto novamente no mesmo navegador.

## IMAGENS
As imagens dos fabricantes/setores utilizadas no sistema são as imagens fornecidas juntamente com o código-fonte original da atividade.

## CONTROLE DE FONTE
O sistema possui controles para aumentar e diminuir o tamanho do texto do painel, facilitando a leitura e a acessibilidade.

## DESENVOLVIMENTO
Projeto desenvolvido em React como adaptação do sistema original da Simulação Scrum Competitiva.

## CONTROLE DE FONTE
Os botões "A−" / "A" / "A+" no canto superior direito aumentam ou
diminuem o tamanho do texto em todo o painel.

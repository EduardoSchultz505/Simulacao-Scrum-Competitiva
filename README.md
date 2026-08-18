# Simulação Scrum Competitiva

Trabalho da disciplina **Desenvolvimento Web 2**.

Esse sistema de apoio à avaliação da Simulação Scrum Competitiva foi refeita, agora, utilizando a biblioteca React. O código original foi proporcionado pelo professor Renato Castro. O grupo deveria dividir o código e organizá-lo em componentes, adicionar função de LocalStorage e hospedar o site, algo que anteriormente não possuia.

## Integrantes

- Eduardo Schultz de Oliveira
- Evelyn Thomaz Mafessoni
- Guilherme Otávio Riffel Konig
- Isabella Vitória Fracaro

## Link do sistema hospedado

> _(placeholder — adicionar link após o deploy)_

## Pré-requisitos

- [Node.js](https://nodejs.org/)

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone <link-do-repositorio>
cd <pasta-do-projeto>
npm install
```

## Executando localmente

```bash
npm run dev
```

Isso inicia o servidor de desenvolvimento do Vite. Por padrão, o sistema fica disponível em:

```
http://localhost:5173
```

Abra esse endereço no navegador.

## Funcionalidades

- **Configuração**: identificação da turma, nomes das empresas, nomes dos times e pesos usados no cálculo da nota final.
- **Alunos**: atribuição de papel, empresa e time para cada aluno, com busca por nome e importação de lista via planilha Excel (.xlsx).
- **Escalação**: visão consolidada das equipes, com identidade visual de cada empresa/comprador.
- **Avaliação por papel**: abas de Scrum Master, Owner/Stakeholder, Product Owner, Developers e Compradores (desempenho no papel e avaliação do produto).
- **Corrupção & Sabotagem**: mecanismos de regras fixas do jogo, com pontuação calculada automaticamente.
- **Resultado Final**: nota final por empresa, calculada como média ponderada das notas por papel, ajustada pelos pontos de corrupção/sabotagem.
- **Persistência**: os dados são salvos automaticamente no `localStorage` do navegador a cada alteração, além de poderem ser salvos/baixados manualmente em `.json` e recarregados posteriormente.

## Tecnologias utilizadas

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [SheetJS (xlsx)](https://sheetjs.com/) — leitura de planilhas Excel para importação de alunos

## Estrutura do projeto

```
src/
├── App.jsx                    # componente raiz — estado global, inicialização, orquestração
├── components/
│   ├── Alunos.jsx, Owner.jsx, ScrumMaster.jsx, ...  # renderização de cada aba
│   ├── init.js                # registro dos listeners de UI (botões, fonte, abas)
│   └── Topbar.jsx             # Barra superior
├── data/
│   ├── constants.js           # dados fixos (sprints, times, compradores, papéis, imagens, cores)
│   └── datamodel.js           # construção do estado inicial (buildInitialData) e função auxiliar avg
├── storage/
│   ├── persistence.js         # leitura/escrita no localStorage
│   └── save.js                # salvar/carregar/resetar dados

├── utils/
│   ├── domHelpers.js          # geração de HTML reutilizável (selects, inputs) e setByPath
│   ├── eventDelegated.js      # delegação de eventos (mudanças de campo, renomear empresa, importar Excel)
│   ├── fonte.js               # definição e alteração de tamanho de fonte
│   ├── scoring.js             # cálculo de notas e pontuações (corrupção, sabotagem, nota final)
│   └── tabs.js                # definição das abas e renderização do painel ativo
```

## Observações

- Os dados ficam salvos no navegador (`localStorage`) enquanto o sistema não for reiniciado ("Resetar"). O botão "Salvar" também gera um arquivo `.json` para backup manual, que pode ser recarregado posteriormente pelo botão "Carregar".
- As imagens dos fabricantes/setores utilizadas são as fornecidas junto com o código-fonte original.

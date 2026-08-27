# Simulação Scrum Competitiva — Versão Desktop (Electron)

Trabalho da disciplina **Desenvolvimento Web 2**.

Esta é a versão empacotada como **aplicativo desktop** (Windows) da Simulação Scrum Competitiva. É a mesma aplicação da versão web (branch `main`), rodando dentro de uma janela nativa via Electron, com as mesmas funcionalidades e persistência de dados via `localStorage`.

> A versão web, hospedada, é a entrega principal do trabalho. Esta versão desktop é um adicional. Veja o README do branch `main` para a versão web.

## Integrantes

- Eduardo Schultz de Oliveira
- Evelyn Thomaz Mafessoni
- Guilherme Otávio Riffel Konig
- Isabella Fracaro Dalla Costa

## Pré-requisitos

- [Node.js](https://nodejs.org/) (recomendado: versão 18 ou superior)
- npm (já vem junto com o Node.js)
- Windows (o instalador gerado é `.exe`, target NSIS)

## Instalação

```bash
git clone <link-do-repositorio>
cd <pasta-do-projeto>
git checkout electron
npm install
```

## Rodando em modo desenvolvimento

Abre a aplicação em uma janela do Electron, com hot-reload (conectado ao servidor de desenvolvimento do Vite):

```bash
npm run electron:dev
```

## Gerando o instalador

```bash
npm run electron:build
```

O instalador (`Simulação Scrum Competitiva Setup 1.0.0.exe`) e a versão "descompactada" (pasta `win-unpacked/`) são gerados dentro da pasta `release/`.

> **Nota:** o instalador não é assinado digitalmente, então o Windows SmartScreen ou o antivírus podem exibir um aviso ao executá-lo pela primeira vez ("Windows protegeu seu PC" ou similar). Isso é esperado — clique em **"Mais informações"** → **"Executar assim mesmo"** para prosseguir. Da mesma forma, durante a geração do instalador, alguns antivírus podem remover o arquivo `.exe` gerado por falso positivo; caso isso ocorra, adicione uma exclusão temporária para a pasta do projeto nas configurações do antivírus.

## Instalando e executando

1. Rode `npm run electron:build`.
2. Execute o instalador gerado em `release/Simulação Scrum Competitiva Setup 1.0.0.exe`.
3. Siga o assistente de instalação.
4. Abra o aplicativo pelo atalho criado (área de trabalho ou menu iniciar).

## Persistência de dados

Assim como na versão web, os dados são salvos automaticamente no armazenamento local do aplicativo a cada alteração, além de poderem ser salvos/baixados manualmente em `.json` e recarregados posteriormente pelos botões correspondentes na interface.

## Tecnologias utilizadas

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Electron](https://www.electronjs.org/)
- [electron-builder](https://www.electron.build/) — empacotamento e geração do instalador
- [SheetJS (xlsx)](https://sheetjs.com/) — leitura de planilhas Excel para importação de alunos
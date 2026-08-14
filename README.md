## PAINEL DE AVALIAÇÃO — SIMULAÇÃO SCRUM COMPETITIVA
## ====================================================

## COMO USAR
---------
1. Extraia este .zip inteiro para uma pasta no seu computador (não mova
   arquivos de dentro dela separadamente — o index.html depende dos
   caminhos relativos para css/, js/ e images/).
2. Dê duplo clique em "index.html". Ele abre no seu navegador padrão.
3. Ele precisa de internet apenas para carregar a biblioteca de leitura
   de Excel (xlsx.js), usada no botão "Importar Lista de Alunos".

## ESTRUTURA DE PASTAS
--------------------
index.html      -> a página principal (abra este arquivo)
css/style.css   -> aparência (cores, fontes, layout)
js/app.js       -> toda a lógica do painel
images/         -> logos das empresas e imagens dos compradores
data/alunos.xlsx -> cópia da planilha original de alunos (referência)

A lista de 31 alunos da turma já vem pré-carregada na aba "Alunos".
Os nomes das empresas (Maverick Aviation / SkyForge Ind. Aeronáutica)
e dos times (Esquadrão Falcon, Falcon Carggo, SkyForge Combat,
SkyForge Transport) já vêm preenchidos a partir das imagens que você
enviou — tudo editável na aba "Configuração".

## SALVAR E CARREGAR DADOS
------------------------
- "Salvar dados (.json)" baixa um arquivo com tudo que foi
  preenchido até aquele momento.
- "Carregar dados (.json)" reabre esse arquivo depois, em outra
  sessão, e repõe tudo exatamente onde parou.
- Nada fica salvo automaticamente no navegador — o arquivo .json é a
  única cópia persistente. Salve com frequência, especialmente ao
  final de cada Sprint.

## CONTROLE DE FONTE
------------------
Os botões "A−" / "A" / "A+" no canto superior direito aumentam ou
diminuem o tamanho do texto em todo o painel.

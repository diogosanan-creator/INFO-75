# INFO75 | Gestao de Servicos

Aplicacao web local para operacao tecnica da INFO75, com login por sessao HTTP, persistencia em arquivo e painel administrativo para servicos, visitas, orcamentos, financeiro, estoque, clientes e usuarios.

## Execucao local

1. Abra o terminal na pasta do projeto.
2. Copie `.env.example` para `.env` e defina `SANAN_ADMIN_PASSWORD` se estiver criando uma base nova.
3. Rode `node server.js`.
4. Acesse [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Scripts

- `npm start`: inicia o servidor local
- `npm run dev`: inicia o servidor local
- `npm run check`: valida a sintaxe de `app.js` e `server.js`

## Login e recuperacao

- Em bases ja existentes, vale a senha gravada em `data/db.json`.
- Neste projeto analisado, o usuario `admin` continua valido com a senha ja existente no banco atual.
- Para forcar redefinicao local do admin em ambiente controlado, use `SANAN_ADMIN_PASSWORD` junto com `SANAN_ADMIN_PASSWORD_RESET_ON_START=true` e reinicie o servidor.

## Melhorias aplicadas

- autenticacao isolada em `services/auth.js`
- persistencia endurecida em `services/data-store.js`
- auditoria isolada em `services/audit.js`
- criacao de base nova sem senha padrao hardcoded
- preservacao automatica de banco corrompido antes de falhar a inicializacao
- normalizacao de username para reduzir falha de login por caixa alta/baixa

## Limites atuais

- A persistencia ainda usa JSON; o proximo passo profissional e migrar para SQLite.
- As sessoes continuam em memoria; reiniciar o processo encerra as sessoes.
- O frontend ainda esta concentrado em `app.js`; a proxima etapa ideal e modularizar por dominio.

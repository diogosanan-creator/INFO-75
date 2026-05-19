# INFO75 | Gestao de Servicos

Aplicacao web local para operacao tecnica da INFO75, com login por sessao HTTP, persistencia em arquivo e painel administrativo para servicos, visitas, orcamentos, financeiro, estoque, clientes e usuarios.

## Execucao local

1. Abra o terminal na pasta do projeto.
2. Copie `.env.example` para `.env` e defina `SANAN_ADMIN_PASSWORD` para criar ou redefinir a senha do administrador.
3. Rode `node server.js`.
4. Acesse [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Scripts

- `npm start`: inicia o servidor local
- `npm run dev`: inicia o servidor local
- `npm run check`: valida a sintaxe de `app.js` e `server.js`

## Login e recuperacao

- O usuario de administracao e `admin`.
- Quando `SANAN_ADMIN_PASSWORD` estiver definida, a senha do administrador sera sincronizada ao iniciar o servidor, mesmo em bases ja existentes.
- Para impedir essa sincronizacao automatica, defina `SANAN_ADMIN_PASSWORD_RESET_ON_START=false`.

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

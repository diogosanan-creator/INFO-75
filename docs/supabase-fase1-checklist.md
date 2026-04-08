# Fase 1 - Setup Supabase (Checklist)

## 1) Projeto e ambientes
- [ ] Criar projeto Supabase de desenvolvimento
- [ ] Criar projeto Supabase de produção (separado)
- [ ] Guardar URL e chaves em local seguro

## 2) Variáveis de ambiente
- [ ] Definir `SUPABASE_URL`
- [ ] Definir `SUPABASE_ANON_KEY`
- [ ] Definir `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Nunca commitar `.env` real

## 3) Segurança inicial
- [ ] Confirmar `.gitignore` cobrindo `.env` e `data/`
- [ ] Revisar permissões de acesso ao repositório
- [ ] Rotacionar chaves se houve exposição prévia

## 4) Banco (estrutura inicial)
- [ ] Criar tabelas: `users`, `clientes`, `servicos`, `visitas`, `orcamentos`, `financeiro`, `estoque`, `audit_logs`
- [ ] Definir tipos e constraints mínimas
- [ ] Criar índices básicos para filtros de listagem

## 5) Validação de prontidão
- [ ] Testar conexão ao Supabase em ambiente dev
- [ ] Validar leitura simples (health check)
- [ ] Registrar evidência da validação no PR

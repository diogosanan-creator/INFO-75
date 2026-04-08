# Plano de Migração JSON -> Supabase (etapas curtas)

## Objetivo
Migrar `data/db.json` para Supabase com mínimo risco, sem parar operação.

## Fase 1 - Preparação (1 dia)
- Criar projeto Supabase (`dev` e `prod` separados).
- Criar tabelas base: `users`, `clientes`, `servicos`, `visitas`, `orcamentos`, `financeiro`, `estoque`, `audit_logs`.
- Definir variáveis: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- Adicionar `.gitignore` para bloquear `.env` e `data/`.

## Fase 2 - Dual Read (2 dias)
- Criar camada de repositório (`storage`) com interface única.
- Implementar leitura preferencial do Supabase com fallback JSON.
- Validar login, permissões e bootstrap sem escrita em Supabase ainda.

## Fase 3 - Dual Write (2-3 dias)
- Em cada `POST/PATCH/DELETE`, gravar em Supabase e JSON temporariamente.
- Logar divergências (se houver) em `audit_logs`.
- Monitorar consistência por 48h.

## Fase 4 - Backfill e Corte (1 dia)
- Rodar script de migração final do JSON para Supabase.
- Conferir contagens por coleção e amostra de registros.
- Desativar escrita em JSON.
- Manter JSON apenas como backup de rollback por curto período.

## Fase 5 - Endurecimento (1-2 dias)
- Ativar RLS em todas as tabelas.
- Mover fotos de visitas para Supabase Storage (evitar base64 em registro).
- Trocar “save all” por operações por registro (insert/update/delete).
- Revisar índices para filtros mobile.

## Critérios de pronto
- Login e permissões funcionando em Supabase.
- CRUD completo sem uso de JSON.
- Auditoria disponível para admin.
- Sem segredo versionado no repositório.

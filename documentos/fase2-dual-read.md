# Fase 2 - Dual Read (Supabase + fallback JSON)

## Objetivo
Ler dados preferencialmente do Supabase e usar JSON apenas como fallback controlado.

## Estratégia
1. Criar interface única de leitura (`storage.read*`).
2. Implementar adaptador Supabase para leituras.
3. Manter adaptador JSON como fallback.
4. Registrar no log quando fallback for acionado.
5. Não alterar escrita nesta fase.

## Regras
- Supabase disponível: resposta vem do Supabase.
- Supabase indisponível: fallback JSON com log de alerta.
- Sem mudança de contrato da API para o frontend.

## Critérios de pronto
- Bootstrap e listagens funcionando com Supabase.
- Fallback JSON funcionando sem quebrar sessão.
- Logs indicando claramente origem dos dados.

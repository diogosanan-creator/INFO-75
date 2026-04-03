# Checklist de Publicação

1. Copiar o projeto para a VPS
2. Criar `.env` com domínio real e senha forte
3. Rodar `npm run check`
4. Subir com `pm2 start ecosystem.config.cjs`
5. Configurar `Nginx`
6. Ativar `HTTPS` com `Certbot`
7. Testar login, serviços, orçamento, PDF e logout
8. Fazer backup inicial de `data/db.json`

# Guia Completo de Publicação

Este guia mostra como colocar este projeto em produção com `Node.js + PM2 + Nginx + HTTPS`.

## O que você precisa

- uma VPS Linux com acesso SSH
- um domínio apontando para o IP da VPS
- Node.js LTS instalado
- Nginx instalado
- PM2 instalado

## Estrutura recomendada

- aplicação: [server.js](C:/Users/User/Desktop/SANAN/meu%20app/site-servicos/server.js)
- proxy reverso: `Nginx`
- processo do Node: `PM2`
- HTTPS: `Certbot`

## 1. Subir o projeto para a VPS

Copie a pasta do projeto para algo como:

```bash
/var/www/info75-site-servicos
```

## 2. Criar `.env`

Use [.env.example](C:/Users/User/Desktop/SANAN/meu%20app/site-servicos/.env.example) como base.

Exemplo:

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=3000
APP_BASE_URL=https://seudominio.com
SESSION_COOKIE_NAME=sanan_session
SESSION_TTL_MS=28800000
BODY_LIMIT_BYTES=1000000
SANAN_ADMIN_PASSWORD=TroqueEstaSenhaAgora
```

## 3. Validar o projeto

```bash
cd /var/www/info75-site-servicos
npm run check
```

## 4. Subir com PM2

O projeto já vem com [ecosystem.config.cjs](C:/Users/User/Desktop/SANAN/meu%20app/site-servicos/ecosystem.config.cjs).

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Comandos úteis:

```bash
pm2 status
pm2 logs info75-site-servicos
pm2 restart info75-site-servicos
```

## 5. Configurar Nginx

Use o arquivo [deploy/nginx-info75.conf](C:/Users/User/Desktop/SANAN/meu%20app/site-servicos/deploy/nginx-info75.conf) como base.

Fluxo:

```bash
sudo cp deploy/nginx-info75.conf /etc/nginx/sites-available/info75
sudo ln -s /etc/nginx/sites-available/info75 /etc/nginx/sites-enabled/info75
sudo nginx -t
sudo systemctl reload nginx
```

Troque `seudominio.com` pelo domínio real antes de ativar.

## 6. Ativar HTTPS

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
```

## 7. Verificações finais

Teste:

1. login
2. troca de tema
3. serviços
4. orçamento
5. PDFs
6. logout

## 8. Backup

Antes de entrar em operação real:

1. proteja [data/db.json](C:/Users/User/Desktop/SANAN/meu%20app/site-servicos/data/db.json)
2. preserve [data/audit.log](C:/Users/User/Desktop/SANAN/meu%20app/site-servicos/data/audit.log)
3. mantenha cópia de [data](C:/Users/User/Desktop/SANAN/meu%20app/site-servicos/data)

## 9. Limites atuais

Esta base já está preparada para produção inicial, mas ainda não é arquitetura de alta escala.

Próximos passos recomendados:

1. migrar persistência de arquivo para PostgreSQL
2. persistir sessões fora da memória
3. adicionar rate limit no login
4. estruturar logs e monitoramento
5. automatizar backup

## O que falta para eu colocar no ar por você

Eu ainda preciso de acesso externo real, por exemplo:

- acesso SSH à VPS
- domínio já apontado
- ou um ambiente de hospedagem conectado

Sem esse acesso eu consigo preparar tudo, mas não executar o deploy remoto final daqui.

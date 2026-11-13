# Smart Home Guardian

Site demonstrativo de um sistema de monitoramento residencial. O projeto contém uma interface React/Vite e uma API Express que registra solicitações e envia confirmações por e-mail.

## Requisitos

- Node.js e npm
- Credenciais SMTP para enviar e-mails reais

## Executar

Na pasta `smart-home-guardian`, instale as dependências e inicie o site:

```bash
npm install
npm run dev
```

Em outro terminal, na pasta `backend`, instale as dependências e inicie a API:

```bash
npm install
npm run dev
```

Copie `backend/.env.example` para `backend/.env` e configure as variáveis SMTP antes de enviar e-mails. O arquivo `.env` contém credenciais locais e não deve ser versionado.

## Comandos do site

- `npm run build` — gera a versão de produção em `dist/`
- `npm run lint` — verifica o código do site

Os formulários de Planos e Kits são demonstrações: registram solicitações e podem enviar e-mail, mas não processam pagamentos nem realizam envios de produtos.

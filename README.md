# Flow.pay — Gestão comercial
Versão 0.2.0 de testes, construída sobre o projeto inicial React + TypeScript + Vite.

## Implementação
- Cadastro, login, logout e recuperação de senha via Supabase Auth.
- Clientes: criar, editar, pesquisar e exportar CSV.
- Oportunidades: cadastrar, editar valor e etapa, filtrar e visualizar no funil.
- Orçamentos: itens, quantidades, desconto, status, validade, prévia e impressão/PDF pelo navegador.
- Follow-ups: agendar, editar, concluir e reabrir.
- Visão geral e relatórios calculados com os registros da conta.
- Configurações da empresa e modo demonstração temporário, separado do servidor.
- Layout responsivo, manifesto de instalação e rotas preparadas para Cloudflare Pages.

## Execução
Requer Node.js 22 ou superior e npm. Na pasta deste arquivo:

```powershell
npm install
npm test
npm run build
npm run dev
```

Após a instalação bem-sucedida, mantenha e versionе o package-lock.json. As dependências diretas estão fixadas. O primeiro build e a validação visual ainda precisam ser concluídos: a rede do ambiente impediu a instalação dos pacotes.

Copie .env.example para .env e preencha a URL e a chave **publishable** do Supabase. Neste computador, .env já está configurado e é ignorado pelo Git. Nunca use service_role no cliente.

## Banco
Projeto: hamqbrpuhzabdtgsrmhp, região sa-east-1, organização Luca5-santos's Org, plano Free.
Migração aplicada: flowpay_initial_crm. Reprodução: supabase/schema.sql, em um banco novo.

Tabelas: profiles, clients, opportunities, quotes, followups.
Cada conta representa uma empresa. Todas usam user_id = auth.uid() nas políticas de leitura, inclusão e alteração. Não há acesso anônimo. Chaves estrangeiras compostas impedem vínculos com clientes de outra conta. O servidor recalcula o orçamento em centavos e valida quantidade, preço e desconto.

A aplicação não oferece exclusão permanente nesta versão. Contas de equipe, convites e permissões por cargo ainda não foram implementados.

## Publicação gratuita
1. Criar repositório público flowpay no GitHub e enviar o conteúdo desta pasta, sem .env e sem node_modules.
2. Depois do build e dos testes, conectar esse repositório no Cloudflare Pages.
3. Branch: main. Build: npm run build. Diretório de saída: dist. Node: 22.
4. Configurar VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no build do Pages.
5. No Supabase Auth > URL Configuration, cadastrar a URL publicada como Site URL e permitir a URL exata /recuperar e o endereço raiz nos redirects.
6. Testar cadastro, confirmação de e-mail, login, recuperação e persistência entre sessões no domínio publicado.

public/_redirects atende as rotas do React Router. public/_headers adiciona cabeçalhos básicos. Nenhum domínio deve ser comprado; usar o subdomínio gratuito pages.dev.

## Validação executada
- 5 testes Node passaram: centavos, totais, itens inválidos, exportação CSV e data.
- 7 verificações passaram no Postgres: leitura, alteração e inclusão isoladas; proteção contra troca de proprietário; vínculo entre contas bloqueado; cálculo do servidor; desconto inválido rejeitado.
- Fixtures de banco executadas em transação e revertidas.
- Supabase Security Advisors: nenhum aviso no momento da verificação.

## Pendências antes de liberar para usuários
- Instalar dependências, gerar lockfile, passar o compilador e build.
- Validar layout desktop/mobile, formulários e impressão no navegador.
- Validar o fluxo completo de Auth, inclusive e-mail e redirects.
- Criar o repositório remoto, publicar e testar a versão Cloudflare.
- Revisar atualização/auditoria das dependências antes da liberação pública.
- A consulta atual carrega até o limite padrão de linhas do Supabase por tabela. Paginação será necessária para contas maiores.

## Limites desta versão
Cobrança automática, pagamentos, estoque, caixa, equipe, exclusão e operação offline não estão conectados. O manifesto prepara instalação, mas não há cache offline. Valor aprovado em relatórios representa propostas, não dinheiro recebido. A prévia usa os dados atuais do cliente e da empresa; ainda não há revisão imutável de propostas.

Consulte docs/VALIDACAO.md para o roteiro de aceite.

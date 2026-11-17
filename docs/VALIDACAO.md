# Roteiro de aceite — Flow.pay 0.2.0

## Concluído
- [x] Banco remoto criado no plano Free, sa-east-1.
- [x] Estrutura CRM aplicada e políticas de acesso configuradas.
- [x] Isolamento entre duas contas verificado por transação SQL.
- [x] Cálculo de orçamentos no servidor verificado.
- [x] Advisor de segurança sem avisos.
- [x] Testes de regras comerciais e CSV: 5/5.
- [x] Código dos módulos e identidade Flow.pay implementados.
- [x] .env fora do controle de versão.

## Compilação e interface — pendente
- [ ] npm install e package-lock.json criado.
- [ ] npm test e npm run build passam.
- [ ] Inspecionar em 1440px e 390px de largura.
- [ ] Abrir demonstração, criar cliente, oportunidade, orçamento e follow-up.
- [ ] Editar cada registro, filtrar, pesquisar e exportar CSV.
- [ ] Conferir total de 3 itens de R$12,99 com desconto de R$1,00 = R$37,97.
- [ ] Concluir e reabrir retorno; conferir indicadores.
- [ ] Imprimir proposta em A4 sem menus.
- [ ] Sair da demonstração e confirmar que os dados fictícios não aparecem na conta real.

## Integração de autenticação — pendente
- [ ] Cadastrar conta real e confirmar e-mail.
- [ ] Criar registros e conferir persistência após atualizar e entrar novamente.
- [ ] Testar erro de credenciais e recuperação de senha.
- [ ] Configurar redirects no endereço definitivo de testes.
- [ ] Conferir erros de rede e mensagens ao tentar salvar sem conexão.

## Publicação — pendente
- [ ] Repositório público criado em Luca5-santos.
- [ ] Revisar arquivos e confirmar ausência de credenciais privadas.
- [ ] Enviar o código e registrar SHA do commit.
- [ ] Conectar Cloudflare Pages no plano gratuito.
- [ ] Configurar variáveis de build e publicar.
- [ ] Abrir a URL publicada e testar rotas profundas.
- [ ] Repetir cadastro/login e CRUD no endereço publicado.

## Bloqueios observados
A instalação npm falhou com ENOTFOUND registry.npmjs.org. O navegador remoto também retornou erro de sessão. Esses bloqueios impedem afirmar que build, autenticação ponta a ponta ou publicação estão validados.

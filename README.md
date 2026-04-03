🤖 GCS Core System - WhatsApp Intelligent Bot
Este é o motor de atendimento automatizado da GCS Core System Intelligence. Um bot desenvolvido em Node.js para WhatsApp que utiliza lógica de estados (FSM) para guiar o cliente através de um menu interativo de serviços, capturando necessidades específicas e qualificando leads de forma automatizada.

🚀 Funcionalidades
Menu Interativo: Navegação fluida por categorias (Automação, Sites, Portfólios, Dashboards e Vendas).

Captura de Briefing: O bot solicita e armazena um resumo personalizado da necessidade do cliente.

Gestão de Contexto: Controle de etapas por usuário (userContexts), impedindo que as mensagens de clientes diferentes se misturem.

Simulação de Digitação: Delay humanizado (sendStateTyping) para melhor experiência do usuário (UX).

Resumo de Solicitação: Apresenta um checkout de informações antes da confirmação final.

Pronto para Nuvem: Configurado com Express para evitar timeouts em plataformas como Render e Koyeb.

🛠️ Explicação Técnica do Código (index.js)
O arquivo principal está estruturado da seguinte forma:

Servidor de Monitoramento: Utiliza Express para abrir uma porta HTTP (PORT 3000), essencial para que o Render mantenha o serviço ativo.

Motor de Automação: Baseado na biblioteca whatsapp-web.js com estratégia de LocalAuth para persistência de sessão.

Configuração Puppeteer: Otimizado com argumentos --no-sandbox e --disable-gpu para rodar com baixo consumo de memória em servidores Linux (Headless Mode).

Fluxo de Atendimento:

Trigger de Início: Filtro regex para saudações comuns (oi, olá, menu).

Máquina de Estados: O objeto userContexts rastreia se o usuário está escolhendo categoria, serviço ou descrevendo a necessidade.

Tratamento de Erros: Blocos try/catch para garantir que o bot não trave caso ocorra uma falha na leitura de uma mensagem.

🔧 Como Rodar
Instale as dependências: npm install

Inicie o serviço: node index.js

Escaneie o QR Code que aparecerá no terminal.

👨‍💻 Desenvolvedor
Gustavo Geraldo | GCS Core System Intelligence
Transformando dados em eficiência através de desenvolvimento inteligente.
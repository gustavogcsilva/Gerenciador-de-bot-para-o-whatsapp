const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express'); // Adicionado para o Render não dar erro de porta

const app = express();
const port = process.env.PORT || 3000;

// Rota simples para o Render saber que o serviço está vivo
app.get('/', (req, res) => res.send('GCS CORE SYSTEM ONLINE 🚀'));
app.listen(port, () => console.log(`Servidor HTTP rodando na porta ${port}`));

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        // Removemos o caminho fixo com números para evitar erros de versão
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote',
            '--single-process'
        ]
    }
});

const delay = ms => new Promise(res => setTimeout(res, ms));
const userContexts = {}; 

client.on('qr', qr => {
    // No Render, você verá o QR Code nos LOGS do painel
    qrcode.generate(qr, { small: true });
    console.log('--- ESCANEIE O QR CODE NOS LOGS ABAIXO ---');
});

client.on('ready', () => {
    console.log('✅ GCS CORE SYSTEM ONLINE - PRONTO PARA O INSTAGRAM!');
});

// Segurança: Se o bot for desconectado pelo celular
client.on('disconnected', (reason) => {
    console.log('Bot foi desconectado:', reason);
    client.initialize(); // Tenta reconectar
});

client.on('message', async msg => {
    // Proteção: Ignora grupos e mensagens próprias
    if (msg.fromMe || msg.isGroup) return;

    try {
        const chat = await msg.getChat();
        const userId = msg.from;
        const userMessage = msg.body.trim();
        const lowerMessage = userMessage.toLowerCase();
        const contact = await msg.getContact();
        const name = contact.pushname || 'Cliente';
        
        const context = userContexts[userId] || { step: 'inicio' };

        const send = async (text) => {
            await chat.sendStateTyping();
            await delay(1500);
            await client.sendMessage(userId, text);
        };

        // --- LÓGICA DE NAVEGAÇÃO ---

        // VOLTAR AO MENU (Adicionado tratamento para palavras comuns)
        if (/oi|olá|ola|menu|voltar|começar|inicio/i.test(lowerMessage)) {
            userContexts[userId] = { step: 'escolhendo_categoria' };
            return send(`Olá *${name}*! Bem-vindo à *GCS CORE SYSTEM INTELLIGENCE!* 💻\n\nEscolha uma categoria digitando o *NÚMERO*:\n\n1️⃣ *Automação*\n2️⃣ *Sites*\n3️⃣ *Portfólios*\n4️⃣ *Dashboards*\n5️⃣ *Vendas*\n\nOu digite *Valores* para ver a tabela geral.`);
        }

        // 1. ESCOLHA DA CATEGORIA
        if (context.step === 'escolhendo_categoria') {
            const categorias = { '1': 'Automação', '2': 'Sites', '3': 'Portfólios', '4': 'Dashboards', '5': 'Vendas' };
            const catNome = categorias[lowerMessage];

            if (catNome) {
                userContexts[userId] = { step: 'escolhendo_servico', categoria: catNome };
                if (catNome === 'Automação') return send(`🤖 *AUTOMAÇÃO*\n1. Bot de Cobrança\n2. Bot de Atendimento\n\nDigite o número:`);
                if (catNome === 'Sites') return send(`🖥 *SITES*\n1. Site simples\n2. Site complexo\n\nDigite o número:`);
                if (catNome === 'Portfólios') return send(`📂 *PORTFÓLIOS*\n1. Pronto\n2. Do zero\n\nDigite o número:`);
                if (catNome === 'Dashboards') return send(`📊 *DASHBOARDS*\n1. Vendas/Estoque\n\nDigite o número:`);
                if (catNome === 'Vendas') return send(`🛍 *VENDAS*\n1. Loja Virtual\n2. Cardápio Digital\n\nDigite o número:`);
            }
        }

        // 2. ESCOLHA DO SERVIÇO
        if (context.step === 'escolhendo_servico' && /^[1-9]$/.test(lowerMessage)) {
            const opcoes = {
                'Automação': { '1': 'Bot de Cobrança', '2': 'Bot de Atendimento' },
                'Sites': { '1': 'Site Simples', '2': 'Site Complexo' },
                'Portfólios': { '1': 'Portfólio Pronto', '2': 'Criação do Zero' },
                'Dashboards': { '1': 'Dashboard Vendas' },
                'Vendas': { '1': 'Loja Virtual', '2': 'Cardápio Digital' }
            };

            const servico = opcoes[context.categoria]?.[lowerMessage];

            if (servico) {
                userContexts[userId] = { 
                    step: 'descrevendo_necessidade', 
                    categoria: context.categoria, 
                    servico: servico 
                };
                return send(`Ótima escolha! 🚀\n\nAgora, por favor, escreva um *breve resumo* do que você precisa:\n\n_(Ex: Quero um site para minha oficina com agendamento)_`);
            }
        }

        // 3. CAPTURAR O RESUMO
        if (context.step === 'descrevendo_necessidade') {
            userContexts[userId].resumo = userMessage;
            userContexts[userId].step = 'confirmando';

            return send(`📝 *RESUMO DA SOLICITAÇÃO*\n\n👤 *Cliente:* ${name}\n📂 *Categoria:* ${context.categoria}\n🛠 *Serviço:* ${context.servico}\n📝 *Necessidade:* "${userMessage}"\n\n*Os dados estão corretos?*\nDigite *SIM* para confirmar ou *MENU* para reiniciar.`);
        }

        // 4. CONFIRMAÇÃO FINAL
        if (context.step === 'confirmando' && lowerMessage === 'sim') {
            delete userContexts[userId];
            return send(`✅ *SOLICITAÇÃO ENVIADA!*\n\n${name}, nossa equipe técnica recebeu seu resumo. Em breve entraremos em contato para apresentar a solução da *GCS CORE SYSTEM*!`);
        }

        if (lowerMessage === 'valores') {
            return send(`💰 *TABELA GERAL GCS*\n\n- Automações: Sob consulta\n- Sites: Sob consulta\n- Dashboards: Sob consulta\n\nNavegue pelo menu para um orçamento personalizado.`);
        }

    } catch (error) {
        console.error("Erro ao processar mensagem:", error);
    }
});

client.initialize();
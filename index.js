const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.status(200).send('GCS CORE SYSTEM ONLINE 🚀'));
app.listen(port, () => console.log(`✅ Servidor ativo na porta ${port}`));

// Objeto para controlar o estado de cada usuário (Memória temporária)
const userState = {};

const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
    puppeteer: {
        headless: true,
        executablePath: process.env.RENDER ? 
            '/opt/render/.cache/puppeteer/chrome/linux-146.0.7680.153/chrome-linux64/chrome' : 
            undefined,
        args: [
            '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
            '--disable-gpu', '--no-zygote', '--single-process'
        ]
    }
});

client.on('qr', (qr) => qrcode.generate(qr, { small: true }));
client.on('ready', () => console.log('✅ GCS CORE SYSTEM PRONTO!'));

client.on('message', async (msg) => {
    try {
        const chat = await msg.getChat();
        if (chat.isGroup || msg.from === 'status@broadcast' || msg.fromMe) return;

        const contact = await msg.getContact();
        const nomeUsuario = contact.pushname || 'Cliente';
        const userMessage = msg.body.trim();
        const userId = msg.from;

        // 1. Resetar/Iniciar Atendimento (Menu Principal)
        if (['oi', 'olá', 'ola', 'menu', 'inicio'].includes(userMessage.toLowerCase())) {
            delete userState[userId]; // Limpa estados anteriores
            const saudacao = `👋 Olá, *${nomeUsuario}*! Bem-vindo à *GCS Core System* 🚀

Escolha uma opção para começarmos:

1️⃣ *Site ou Sistema*
2️⃣ *Robôs de Atendimento*
3️⃣ *Relatórios Inteligentes*
4️⃣ *Falar com Gustavo Silva*
5️⃣ *Encerrar*

*Atenção:* Após escolher, pedirei um breve resumo. Evite enviar várias mensagens seguidas para não travar o sistema.`;
            return await client.sendMessage(userId, saudacao);
        }

        // 2. Fluxo de Captura de Resumo (Se o usuário já escolheu uma opção)
        if (userState[userId] && userState[userId].step === 'AWAITING_SUMMARY') {
            userState[userId].summary = userMessage;
            userState[userId].step = 'AWAITING_CONFIRMATION';
            
            return await msg.reply(`📝 *Confirmação de Solicitação*

Você descreveu: "_${userMessage}_"

Está correto? Digite *SIM* para enviar ou *MENU* para recomeçar.`);
        }

        // 3. Fluxo de Confirmação Final
        if (userState[userId] && userState[userId].step === 'AWAITING_CONFIRMATION') {
            if (userMessage.toUpperCase() === 'SIM') {
                await msg.reply(`✅ *Solicitação Enviada com Sucesso!*

Obrigado, *${nomeUsuario}*. Sua mensagem sobre "${userState[userId].optionName}" foi registrada. 

⏳ *Aguarde:* O Gustavo Silva entrará em contato em breve. Não é necessário enviar novas mensagens, o tempo de resposta pode variar conforme a demanda.`);
                
                // Aqui você poderia enviar uma notificação para você mesmo com o resumo
                delete userState[userId]; 
                return;
            }
        }

        // 4. Seleção Inicial do Menu
        const opcoes = {
            '1': 'Site ou Sistema',
            '2': 'Robôs de Atendimento',
            '3': 'Relatórios Inteligentes',
            '4': 'Conversa com Gustavo Silva'
        };

        if (opcoes[userMessage]) {
            userState[userId] = {
                step: 'AWAITING_SUMMARY',
                option: userMessage,
                optionName: opcoes[userMessage]
            };
            
            chat.sendStateTyping();
            return await msg.reply(`💻 Você escolheu: *${opcoes[userMessage]}*.

Por favor, descreva em *poucas palavras* o seu problema ou o que você precisa:`);
        }

        // Opção de encerramento
        if (userMessage === '5') {
            delete userState[userId];
            return await msg.reply(`🙏 Obrigado pelo contato, *${nomeUsuario}*! Tenha um excelente dia.`);
        }

    } catch (error) {
        console.error('❌ Erro:', error);
    }
});

client.initialize();

process.on('uncaughtException', (err) => console.error('❌ ERRO CRÍTICO:', err));
process.on('unhandledRejection', (reason) => console.error('⚠️ REJEIÇÃO:', reason));
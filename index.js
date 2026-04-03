// 1. IMPORTAÇÕES
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const fs = require('fs');
const path = require('path');

// 2. CONFIGURAÇÃO DO EXPRESS (WEB SERVICE)
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('GCS CORE SYSTEM ONLINE 🚀'));
app.listen(port, () => console.log(`✅ Servidor HTTP rodando na porta ${port}`));

// 3. FUNÇÃO DE BUSCA DO CHROME (Precisa vir antes do Client)
const getChromePath = () => {
    const baseDir = '/opt/render/.cache/puppeteer/chrome';
    console.log(`🔍 Verificando diretório de cache: ${baseDir}`);
    
    if (fs.existsSync(baseDir)) {
        const folders = fs.readdirSync(baseDir);
        console.log(`📂 Pastas encontradas no cache: ${folders.join(', ')}`);
        
        if (folders.length > 0) {
            // Monta o caminho: base + versão + subpasta do binário
            const chromePath = path.join(baseDir, folders[0], 'chrome-linux64/chrome');
            console.log(`🚀 Tentando iniciar Chrome em: ${chromePath}`);
            
            if (fs.existsSync(chromePath)) {
                return chromePath;
            } else {
                console.log('⚠️ Caminho do executável não existe fisicamente.');
            }
        }
    }
    console.log('💡 Usando fallback: /usr/bin/google-chrome');
    return '/usr/bin/google-chrome';
};

// 4. INICIALIZAÇÃO DO WHATSAPP CLIENT
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: getChromePath(), // CHAMA A FUNÇÃO AQUI
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

// 5. EVENTOS DO CLIENTE (QR, Ready, Message...)
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('--- ESCANEIE O QR CODE ---');
});

client.on('ready', () => {
    console.log('✅ GCS CORE SYSTEM ONLINE - WHATSAPP CONECTADO!');
});

// ... (Aqui entra sua lógica de mensagens e menus que já criamos)

client.initialize();

// 6. TRATAMENTO DE ERROS GLOBAIS (Sempre no final)
process.on('uncaughtException', (err) => {
    console.error('❌ ERRO CRÍTICO NÃO TRATADO:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ REJEIÇÃO NÃO TRATADA EM:', promise, 'razão:', reason);
});
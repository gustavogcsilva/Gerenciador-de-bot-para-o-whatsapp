const getChromePath = () => {
    // No Render, o cache costuma ficar um nível acima ou na raiz do projeto
    const paths = [
        '/opt/render/.cache/puppeteer/chrome',
        path.join(process.cwd(), '.cache/puppeteer/chrome')
    ];

    for (const baseDir of paths) {
        console.log(`🔍 Verificando: ${baseDir}`);
        if (fs.existsSync(baseDir)) {
            const folders = fs.readdirSync(baseDir);
            if (folders.length > 0) {
                // Tenta o padrão novo do Puppeteer
                const chromePath = path.join(baseDir, folders[0], 'chrome-linux64', 'chrome');
                if (fs.existsSync(chromePath)) return chromePath;
                
                // Tenta o padrão antigo/alternativo
                const altPath = path.join(baseDir, folders[0], 'chrome-linux-x-64', 'chrome');
                if (fs.existsSync(altPath)) return altPath;
            }
        }
    }
    console.log('⚠️ Nenhum Chrome encontrado no cache. Usando padrão do sistema.');
    return '/usr/bin/google-chrome';
};

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: getChromePath(),
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

// Inicialização com tratamento de erro
client.initialize().catch(err => {
    console.error('❌ FALHA AO INICIAR O WHATSAPP:', err.message);
});
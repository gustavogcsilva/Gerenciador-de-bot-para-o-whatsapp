 const getChromePath = () => {
    const baseDir = '/opt/render/.cache/puppeteer/chrome';
    console.log(`🔍 Verificando diretório de cache: ${baseDir}`);
    
    if (fs.existsSync(baseDir)) {
        const folders = fs.readdirSync(baseDir);
        console.log(`📂 Pastas encontradas no cache: ${folders.join(', ')}`);
        
        if (folders.length > 0) {
            // O Render coloca dentro de: pasta_versao/chrome-linux64/chrome
            const chromePath = path.join(baseDir, folders[0], 'chrome-linux64', 'chrome');
            console.log(`🚀 Tentando iniciar Chrome em: ${chromePath}`);
            
            if (fs.existsSync(chromePath)) {
                return chromePath;
            } else {
                console.log('⚠️ Arquivo não encontrado no caminho completo. Tentando alternativa...');
                // Tentativa alternativa caso a estrutura mude
                const altPath = path.join(baseDir, folders[0], 'chrome-linux-x64', 'chrome');
                if (fs.existsSync(altPath)) return altPath;
            }
        }
    }
    console.log('💡 Usando fallback do sistema');
    return '/usr/bin/google-chrome';
};
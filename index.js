const getChromePath = () => {
    const baseDir = '/opt/render/.cache/puppeteer/chrome';
    console.log(`🔍 Verificando diretório de cache: ${baseDir}`);
    
    if (fs.existsSync(baseDir)) {
        const folders = fs.readdirSync(baseDir);
        console.log(`📂 Pastas encontradas no cache: ${folders.join(', ')}`);
        
        if (folders.length > 0) {
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
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

let latestQr = '';

// Servidor Web para exibir o QR Code em imagem no navegador
app.get('/', (req, res) => {
    if (!latestQr) {
        return res.send('<h2 style="font-family:sans-serif;text-align:center;margin-top:50px;">O QR Code ainda está a gerar ou o bot já está conectado! Recarregue a página em alguns segundos.</h2>');
    }
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(latestQr)}`;
    res.send(`
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
            <h2>Aponte a câmara do WhatsApp para este QR Code:</h2>
            <img src="${qrImageUrl}" style="width:300px;height:300px;border:1px solid #ccc;padding:10px;border-radius:8px;" />
        </div>
    `);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor HTTP a rodar na porta ${PORT}`);
});

// Configuração do Bot
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    latestQr = qr;
    console.log('NOVO QR CODE GERADO! Acesse a URL do site para visualizar.');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    latestQr = '';
    console.log('BOT CONECTADO COM SUCESSO!');
});

client.on('message', async (message) => {
    const texto = message.body.toLowerCase().trim();

    if (texto === 'oi' || texto === 'olá' || texto === 'ola') {
        await message.reply('Olá! Sou o bot do Verol!');
    } else if (texto === 'menu') {
        await message.reply(
            'MENU DO BOT\n' +
            '1 - Preços\n' +
            '2 - Informações\n' +
            '3 - Ajuda\n' +
            'Digite uma opção.'
        );
    } else if (texto === '1') {
        await message.reply('Consulte os nossos preços com o administrador.');
    } else if (texto === '2') {
        await message.reply('Bem-vindo! Este é o bot automático do Verol.');
    } else if (texto === '3') {
        await message.reply('Digite *menu* para ver as opções disponíveis.');
    }
});

client.initialize();

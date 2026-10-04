const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

// Mini servidor Web para o Render manter o bot ativo
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot do Verol est  ativo 24/7!');
});

app.listen(PORT, () => {
    console.log(`Servidor HTTP a rodar na porta ${PORT}`);
});

// Configura‡Æo do Bot
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('Escaneie este QR Code com o WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('BOT CONECTADO COM SUCESSO!');
});

client.on('message', async (message) => {
    const texto = message.body.toLowerCase().trim();

    if (texto === 'oi' || texto === 'ol ' || texto === 'ola') {
        await message.reply('Ol ! Sou o bot do Verol');
    } 
    else if (texto === 'menu') {
        await message.reply(
            'MENU DO BOT\n\n' +
            '1 - Pre‡os\n' +
            '2 - Informa‡äes\n' +
            '3 - Ajuda\n\n' +
            'Digite uma op‡Æo.'
        );
    } 
    else if (texto === '1') {
        await message.reply('Consulte os nossos pre‡os com o administrador.');
    } 
    else if (texto === '2') {
        await message.reply('Bem-vindo! Este ‚ o bot autom tico do Verol.');
    } 
    else if (texto === '3') {
        await message.reply('Digite *menu* para ver as op‡äes dispon¡veis.');
    }
});

client.initialize();

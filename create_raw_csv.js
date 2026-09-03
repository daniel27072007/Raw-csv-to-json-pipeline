import fs from 'fs';
import path from 'path';

const INPUT_FOLDER = './data_input';
const FILE_PATH = path.join(INPUT_FOLDER, 'raw_export.csv');

// Garante que a pasta data_input existe
if (!fs.existsSync(INPUT_FOLDER)) {
    fs.mkdirSync(INPUT_FOLDER, { recursive: true });
}

const generateMassiveCSV = () => {
    console.log('⏳ Iniciando a geração do arquivo CSV gigante (> 200MB)...');
    console.time('Tempo de geração');

    const writeStream = fs.createWriteStream(FILE_PATH, 'utf-8');

    // Cabeçalho com os espaços extras clássicos do sistema legado
    writeStream.write('timestamp, event_id, user_email,   action_type, revenue_amount, status\n');

    // Arrays de dados para randomizar os erros
    const emails = ['USER1@GMAIL.COM ', ' user2@yahoo.com', 'ANTONIO@OUTLOOK.COM', 'test.user@company.co  '];
    const actions = [' purchase', 'page_view', ' click ', 'add_to_cart'];
    const revenues = [' $150.00', ' 45.50 ', ' ', 'invalid_value', '$99.99'];
    const statuses = [' success', ' SUCCESS', 'failed', ' PENDING '];

    // 2.65 milhões de linhas geram aproximadamente 210MB de dados
    const totalLines = 2650000; 

    for (let i = 0; i < totalLines; i++) {
        const timestamp = `2026-03-01 09:15:${String(i % 60).padStart(2, '0')}`;
        
        // Simula duplicidade: a cada 10 linhas, repetimos um ID antigo em vez de criar um novo
        const event_id = (i % 10 === 0) 
            ? `#id_${i - 5}` 
            : `#id_${i}`;

        // Sorteia variações de dados para simular as anomalias do legado
        const email = emails[i % emails.length];
        const action = actions[i % actions.length];
        const revenue = revenues[i % revenues.length];
        const status = statuses[i % statuses.length];

        const csvRow = `${timestamp}, ${event_id}, ${email}, ${action}, ${revenue}, ${status}\n`;
        
        writeStream.write(csvRow);

        // Feedback visual a cada 500 mil linhas para você não achar que travou
        if (i > 0 && i % 500000 === 0) {
            console.log(`... ${i} linhas gravadas ...`);
        }
    }

    writeStream.end();

    writeStream.on('finish', () => {
        console.timeEnd('Tempo de geração');
        const stats = fs.statSync(FILE_PATH);
        const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`\n🎉 Arquivo gerado com sucesso absoluto!`);
        console.log(`📍 Local: ${FILE_PATH}`);
        console.log(`📦 Tamanho final: ${fileSizeInMB} MB`);
        console.log(`🚀 Pronto para testar o limite de performance do seu script.`);
    });
};

generateMassiveCSV();
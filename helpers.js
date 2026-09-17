const fs = require('fs');
const path = require('path');

// Encontra a rota
function encontrarRota(rotas, endpoint, metodoHttp)
{
    console.log(rotas, endpoint, metodoHttp);
    return rotas.find(
        (rota) => rota.endpoint === endpoint && rota.metodoHttp === metodoHttp
    );
}

// Pega a página a partir do nome
function paginaHtml(fileName)
{
    return path.join(__dirname, 'paginas', fileName);
}
 
function lerArquivoHtml(caminhoArquivo)
{
    try {
        return fs.readFileSync(caminhoArquivo, 'utf-8');
    } catch (erro) {
        console.error(`Erro ao ler arquivo ${caminhoArquivo}:`, erro.message);
        return '<html><body><h1>Erro interno ao ler o arquivo</h1></body></html>';
    }
}


// Monta a resposta com o cabeçalho
function montarResposta(status, statusText, corpoHtml)
{
    const corpo = Buffer.from(corpoHtml, 'utf-8');
    const cabecalhos =
        `HTTP/1.1 ${status} ${statusText}\r\n` +
        `Content-Type: text/html; charset=utf-8\r\n` +
        `Content-Length: ${corpo.length}\r\n` +
        `Connection: close\r\n` +
        `\r\n`;

    return Buffer.concat([Buffer.from(cabecalhos, 'utf-8'), corpo]);
}

module.exports = { encontrarRota, lerArquivoHtml, montarResposta, paginaHtml };
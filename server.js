const net = require('net');

const { Method, Route } = require('./route');
const { encontrarRota, lerArquivoHtml, montarResposta, paginaHtml } = require('./helpers');

const HOST = '127.0.0.1';
const PORT = 8080;

const rotas = [
    new Route('/', Method.GET, paginaHtml('index.html')),
    new Route('/sobre', Method.GET, paginaHtml('sobre.html'))
];

const Html_404 = paginaHtml('404.html')

// Trata a requisição
function tratarRequisicao(requisicaoBruta, socket)
{
    console.log('----- Requisição recebida -----');
    console.log(requisicaoBruta);
    console.log('--------------------------------');
    
    const linhas = requisicaoBruta.split('\r\n');
    const [metodo, caminhoCompleto] = linhas[0].split(' ');
    const endpoint = (caminhoCompleto || '/').split('?')[0];
        
    const metodoHttp = Object.values(Method).includes(metodo) ? metodo : null;
    
    let resposta;
    const rota = encontrarRota(rotas, endpoint, metodoHttp);
    
    if (rota)
    {
        const html = lerArquivoHtml(rota.arquivoResposta);
        resposta = montarResposta(200, 'OK', html);
    } 
    else
    {
        const html = lerArquivoHtml(Html_404);
        resposta = montarResposta(404, 'Not Found', html);
    }
    
    socket.write(resposta);
    socket.end();
}

// Cria servidor
const servidor = net.createServer((socket) => {
    console.log(`Cliente conectado: ${socket.remoteAddress}:${socket.remotePort}`);
    
    let bufferDados = '';
    
    socket.on('data', (chunk) => {
        bufferDados += chunk.toString('utf-8');
    
        if (bufferDados.includes('\r\n\r\n')) {
        tratarRequisicao(bufferDados, socket);
        bufferDados = '';
        }
    });
    
    socket.on('error', (erro) => {
        console.error('Erro no socket do cliente:', erro.message);
    });
    
    socket.on('close', () => {
        console.log(`Cliente desconectado: ${socket.remoteAddress}:${socket.remotePort}`);
    });
});

// Handler erros
servidor.on('error', (erro) => {
    console.error('Erro no servidor:', erro.message);
});
    
// Inicializa servidor
servidor.listen(PORT, HOST, () => {
    console.log(`Servidor TCP escutando em http://${HOST}:${PORT}/`);
    console.log('Rotas disponíveis:', rotas.map((r) => `${r.metodoHttp} ${r.endpoint}`).join(', '));
    console.log('Pressione Ctrl+C para encerrar.');
});
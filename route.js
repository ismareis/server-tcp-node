const Method = Object.freeze({
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
});

class Route {
    constructor(endpoint, metodoHttp, arquivoResposta) {
        this.endpoint = endpoint;
        this.metodoHttp = metodoHttp;
        this.arquivoResposta = arquivoResposta;
    }
}

module.exports = { Method, Route };
@isTest
global class basicAuthCalloutMock implements HttpCalloutMock {

    global HttpResponse respond(HTTPRequest req) {
        System.assertEquals('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL', req.getEndpoint());
        System.assertEquals('GET', req.getMethod());

        HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setBody('{"USDBRL":{"code":"USD","codein":"BRL","name":"Dólar Americano/Real Brasileiro","high":"4.7793","low":"4.6985","varBid":"-0.0162","pctChange":"-0.34","bid":"4.7352","ask":"4.7377","timestamp":"1654009964","create_date":"2022-05-31 12:12:44"},"EURBRL":{"code":"EUR","codein":"BRL","name":"Euro/Real Brasileiro","high":"5.1241","low":"5.0336","varBid":"-0.0426","pctChange":"-0.83","bid":"5.0779","ask":"5.0808","timestamp":"1654009965","create_date":"2022-05-31 12:12:45"},"BTCBRL":{"code":"BTC","codein":"BRL","name":"Bitcoin/Real Brasileiro","high":"153.425","low":"143.5","varBid":"5377","pctChange":"3.71","bid":"150.309","ask":"150.636","timestamp":"1654009822","create_date":"2022-05-31 12:10:22"}}');
            res.setStatusCode(200);
        return res;
    }
}

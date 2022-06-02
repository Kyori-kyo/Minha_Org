public class Controller_CotacaoDiaria {

    public static HTTPResponse calloutMoeda(){
        HttpRequest req = new HttpRequest();
            req.setEndpoint('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL');
            req.setMethod('GET');
            
            // Create a new http object to send the request object
            // A response object is generated as a result of the request  
            
            Http http = new Http();
        HTTPResponse res = http.send(req);
        return res;
        
    }

    @AuraEnabled
    public static Map<String, Object> buscaCotacoes(){
        HTTPResponse res = calloutMoeda();
            res.getBody();
            System.debug(res.getBody());
            Map<String, Object> mapName = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            // Map<String, Object> resultUSD = (Map<String, Object>) mapName.get('USDBRL');
        return mapName;
    }

    @AuraEnabled
    public static Map<String, Object> buscaCotacao(String moeda){
        HTTPResponse res = calloutMoeda();
            res.getBody();
            System.debug(res.getBody());
            Map<String, Object> mapName = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            Map<String, Object> resultMoeda = (Map<String, Object>) mapName.get(moeda);
        return resultMoeda;
    }
}

// sfdx force:source:deploy -p "force-app\main\default\classes\Controller_CotacaoDiaria.cls,force-app\main\default\classes\Test_CotacaoDiariaCalloutMock.cls,force-app\main\default\classes\Test_Controller_CotacaoDiaria.cls" -l RunSpecifiedTests -r Test_Controller_CotacaoDiaria -u connection_datago


// 1: pegar as informações da API, 2: faz login na org para autorizar a api, 3: converter essas informações para JSON
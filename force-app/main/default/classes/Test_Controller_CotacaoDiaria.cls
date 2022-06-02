@isTest
public class Test_Controller_CotacaoDiaria {
    
    @isTest 
    static void testCallout() {    
        
        Test.startTest();
            // This causes a fake response to be generated
            Test.setMock(HttpCalloutMock.class, new basicAuthCalloutMock());
            
            // Call the method that invokes a callout
            HttpResponse response = Controller_CotacaoDiaria.calloutMoeda();
            // String expected = '{"bid" = "4.7527"}';

            
            // Verify that a fake result is returned
            System.assertEquals(200, response.getStatusCode());

            Map<String, Object> mapName = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            Map<String, Object> resultUSD = (Map<String, Object>) mapName.get('USDBRL');


            System.assertEquals((String) resultUSD.get('bid'), '4.7352');


            Map<String, Object> mapName2 = Controller_CotacaoDiaria.buscaCotacoes();
        

            Map<String, Object> resultUSD2 = Controller_CotacaoDiaria.buscaCotacao('USDBRL');
            System.assertEquals((String) resultUSD2.get('bid'), '4.7352');

        Test.stopTest();
    }
}   

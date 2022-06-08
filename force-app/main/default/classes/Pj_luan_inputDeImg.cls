public with sharing class Pj_luan_inputDeImg {

    @AuraEnabled
    public static String createProduct(String nomeProd, Decimal precoProd, Decimal qtdProd, String idOpp){
        try {
            Opportunity opp = [
                SELECT Id, Pricebook2Id, CurrencyIsoCode
                FROM Opportunity 
                WHERE Id = :idOpp
            ];
    
            Product2 novoProd = new Product2();
                novoProd.Name = nomeProd;
                novoProd.Description = nomeProd;
            Insert novoProd;
    
    
            PriceBook2 pb2Standard = [
                SELECT Id 
                FROM Pricebook2 
                WHERE isStandard=true
            ];
    
            PricebookEntry objPBEntry = new PricebookEntry();
                // objPBEntry.Pricebook2Id = opp.Pricebook2Id;
                objPBEntry.CurrencyIsoCode = opp.CurrencyIsoCode;
    
                // if (objPBEntry.Pricebook2Id == null || objPBEntry.Pricebook2Id == '') {
                    objPBEntry.Pricebook2Id = pb2Standard.Id;
                    // opp.Pricebook2Id = pb2Standard.Id;
                    // update opp;
                // }
                
                objPBEntry.Product2Id = novoProd.Id;
                objPBEntry.UnitPrice = precoProd;
                objPBEntry.IsActive = true;
            Insert objPBEntry;
        
            OpportunityLineItem objLineItem = new OpportunityLineItem();
                objLineItem.PriceBookEntryId = objPBEntry.Id;
                objLineItem.OpportunityId = idOpp;
                objLineItem.Quantity = qtdProd;
                objLineItem.Unitprice = precoProd;
            Insert objLineItem;

            return 'Sucesso! O Produto foi criado com sucesso.';
            
        } catch (Exception error) {
            return 'Erro! O Problema foi tal: '+error.getMessage();
        }
    }
}
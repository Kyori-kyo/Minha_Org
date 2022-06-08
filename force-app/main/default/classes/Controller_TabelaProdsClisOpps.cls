public with sharing class Controller_TabelaProdsClisOpps {
   
    public class TableProds {

        @AuraEnabled
        public Id prodId{ get; set; }
        @AuraEnabled
        public String prodName{ get; set; }
        @AuraEnabled
        public String prodProductsCode{ get; set; }

        @AuraEnabled
        public Id entryId { get; set; }   
        @AuraEnabled
        public Decimal entryUnitPrice { get; set; }   
        @AuraEnabled
        public String entryTableName { get; set; }   
        @AuraEnabled
        public Decimal quantity { get; set; }   
    }

    @AuraEnabled
    public static List<TableProds> buscarProdutos() {
        
        List<PricebookEntry> entries = [
            SELECT Product2Id, UnitPrice, Pricebook2.Name 
            FROM PricebookEntry 
            WHERE Pricebook2.IsStandard = TRUE
        ];

        Map<Id, PricebookEntry> mapEntry = new Map<Id, PricebookEntry>();
        for (PricebookEntry entry : entries) {
            mapEntry.put(entry.Product2Id, entry);
        }

        Product2[] products = [
            SELECT Id, Name, ProductCode
            FROM Product2
            WHERE Id IN (SELECT Product2Id FROM PricebookEntry WHERE Pricebook2.IsStandard = TRUE)
        ];

        List<TableProds> tableProdsVar = new List<TableProds>(); 
        for (Product2 product : products) {
            PricebookEntry entry = mapEntry.get(product.Id);

            TableProds tableProdsVar2 = new TableProds();

                tableProdsVar2.prodId = product.Id;
                tableProdsVar2.prodName = product.Name;
                tableProdsVar2.prodProductsCode = product.ProductCode;

                tableProdsVar2.entryId = entry.Id;
                tableProdsVar2.entryUnitPrice = entry.UnitPrice;
                tableProdsVar2.entryTableName = entry.Pricebook2.Name;
                tableProdsVar2.quantity = 0;

            tableProdsVar.add(tableProdsVar2);
        }

        return tableProdsVar;
    }

    @AuraEnabled
    public static List<Account> buscarContas() {

        Account[] accts = [
            SELECT Id, Name, Phone, AccountNumber
            FROM Account
        ];

        return accts;
    }

    @AuraEnabled
    public static Map<String,Object> inserirDados(Account client, List<TableProds> products){
    
        Map<String,Object> result = new Map<String,Object>();

        try {

            Pricebook2 priceBook2 = [SELECT Id, Name FROM Pricebook2 WHERE IsStandard = TRUE LIMIT 1];
            PricebookEntry priceBookEtr = [SELECT Id, Name, Product2Id FROM PricebookEntry LIMIT 1];
    
            Opportunity Opp = new Opportunity();
                Opp.Pricebook2Id = priceBook2.Id;
                Opp.AccountId = client.Id;
                Opp.CloseDate = System.today();
                Opp.Name = 'This is '+client.Name+' opportuniy';
                Opp.StageName = 'Prospecting';
                Opp.Discount_Percent__c = 0;
                Opp.CurrencyIsoCode = 'BRL';
            insert Opp;
    
            List<OpportunityLineItem> oppItens = new List<OpportunityLineItem>();
    
            for (TableProds product : products) {
                OpportunityLineItem oppItem = new OpportunityLineItem();
                    oppItem.OpportunityId = Opp.Id;
                    oppItem.Product2Id = product.prodId;
                    oppItem.UnitPrice = product.entryUnitPrice;
                    oppItem.Quantity = product.quantity;
                    oppItem.PricebookEntryId = product.entryId;
                oppItens.add(oppItem);
            }
            insert oppItens;
            
                result.put('status', 'success' );
                result.put('success', true );
                result.put('message', 'Opportunidade Criada com Sucesso!' );

            return result;

        } catch (Exception e) {

                result.put('status', 'error' );
                result.put('success', false );
                result.put('message', e.getMessage() );

            return result;
        }
    }

// ------------------Products-------------------------------------------------------------
    @AuraEnabled(cacheable=true)
    public static list<TableProds> getProductList(string searchKey) {

        string searchKeyword = '%' + searchKey + '%';

        List<PricebookEntry> entries = [
            SELECT Product2Id, UnitPrice, Pricebook2.Name 
            FROM PricebookEntry 
            WHERE Pricebook2.IsStandard = TRUE
        ];

        Map<Id, PricebookEntry> mapEntry = new Map<Id, PricebookEntry>();
        for (PricebookEntry entry : entries) {
            mapEntry.put(entry.Product2Id, entry);
        }

        Product2[] products = [
            SELECT Id, Name, ProductCode
            FROM Product2
            WHERE Id IN (SELECT Product2Id FROM PricebookEntry WHERE Pricebook2.IsStandard = TRUE) AND name LIKE : searchKeyword
            ];

        List<TableProds> tableProdsVar = new List<TableProds>(); 
        for (Product2 product : products) {
            PricebookEntry entry = mapEntry.get(product.Id);

            TableProds tableProdsVar2 = new TableProds();

                tableProdsVar2.prodId = product.Id;
                tableProdsVar2.prodName = product.Name;
                tableProdsVar2.prodProductsCode = product.ProductCode;

                tableProdsVar2.entryId = entry.Id;
                tableProdsVar2.entryUnitPrice = entry.UnitPrice;
                tableProdsVar2.entryTableName = entry.Pricebook2.Name;
                tableProdsVar2.quantity = 0;

            tableProdsVar.add(tableProdsVar2);
        }

        return tableProdsVar;
    }

// ------------------ Account -------------------------------------------------------------
    @AuraEnabled(cacheable=true)
    public static list<account> getAccountList(string searchKey) {
        string searchKeyword = '%' + searchKey + '%';
        
    // lista para guardar os resultados
        list<account> accountList = new list<account>();
    
    // query nos registros da conta
        for(account acctObj : [
            SELECT Id, Name, Phone, AccountNumber
            FROM Account
            WHERE name LIKE : searchKeyword
            ]) {
        accountList.add(acctObj);
        }
        
        if(accountList.size() == 0){
            throw new AuraHandledException('No Record Found...'); 
        }
        return accountList;
    }
}


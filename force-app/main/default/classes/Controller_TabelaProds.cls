public with sharing class Controller_TabelaProds {

    //Aqui eu criei método get set pra enviar as variáveis abaixo para o meu lwc e la exibi-las
    public class ProdutoTabela {

        @AuraEnabled
        public Id prodId { get; set; }
        @AuraEnabled
        public String prodName { get; set; }
        @AuraEnabled
        public String prodDescription { get; set; }
        @AuraEnabled
        public String prodProductCode { get; set; }

        @AuraEnabled
        public Id entrId { get; set; }
        @AuraEnabled
        public Decimal entrUnitPrice { get; set; }
        @AuraEnabled
        public String entrTblName { get; set; }
        @AuraEnabled
        public Decimal quantity { get; set; }
    }
    
    @AuraEnabled
    public static List<ProdutoTabela> buscarProdutos() {

        List<PricebookEntry> entradas = [
            SELECT Product2Id, UnitPrice, Pricebook2.Name 
            FROM PricebookEntry 
            WHERE Pricebook2.IsStandard = TRUE
            ];

        Map<Id, PricebookEntry> mapaEntrd = new Map<Id, PricebookEntry>();
        for (PricebookEntry entrada : entradas) {
            mapaEntrd.put(entrada.Product2Id, entrada);
        }
        
        Product2[] produtos = [
            SELECT 
                Id, Name, ProductCode, Description
            FROM Product2
            WHERE Id IN (SELECT Product2Id FROM PricebookEntry WHERE Pricebook2.IsStandard = TRUE)
        ];

        List<ProdutoTabela> prodsTab = new List<ProdutoTabela>();
        for (Product2 prod : produtos) {
            PricebookEntry entrada = mapaEntrd.get(prod.Id);

            ProdutoTabela prodTab = new ProdutoTabela();

                prodTab.prodId = prod.Id;
                prodTab.prodName = prod.Name;
                prodTab.prodDescription = prod.Description;
                prodTab.prodProductCode = prod.ProductCode;

                prodTab.entrId = entrada.Id;
                prodTab.entrUnitPrice = entrada.UnitPrice;
                prodTab.entrTblName = entrada.Pricebook2.Name;
                prodTab.quantity = 0;

            prodsTab.add(prodTab);
        }

        return prodsTab;
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
    public static void inserirDados(Account cliente, List<ProdutoTabela> produtos){
        
        // CRIAR OPORTUNIDADE, PREENCHER OS CAMPOS NECESSARIOS DESSA OPORTUNIDADE, E INSERIR A OPP.

        Pricebook2 priceBk = [SELECT Id, Name  FROM Pricebook2 WHERE IsStandard = TRUE LIMIT 1];
        PricebookEntry PriceBkEtr = [SELECT Id, Name, Product2Id FROM PricebookEntry LIMIT 1];
        
        Opportunity Opp = new Opportunity();
            Opp.Pricebook2Id = priceBk.Id;
            Opp.AccountId = cliente.Id;
            Opp.CloseDate = System.today();
            Opp.Name = 'Oport do '+cliente.Name;
            Opp.StageName = 'Prospecting';
            Opp.Discount_Percent__c = 0;
            Opp.CurrencyIsoCode = 'BRL';
        insert Opp; 

        List<OpportunityLineItem> itensOpp = new List<OpportunityLineItem>();

        for (ProdutoTabela produto : produtos) {
            OpportunityLineItem ItemOpp = new OpportunityLineItem();
                ItemOpp.OpportunityId = Opp.id;
                ItemOpp.Product2Id = produto.prodId;
                ItemOpp.UnitPrice = 42;
                ItemOpp.Quantity = 42;
                ItemOpp.PricebookEntryId = produto.entrId;
            itensOpp.add(ItemOpp);
        }
        insert itensOpp;
    }

    // public static String sucessoOuFalha(){
    //     for (Database.SaveResult ItemOpp : itensOpp) {
    //         if (!ItemOpp.isSuccess()) {
    //             // Operation failed, so get all errors                
    //             for(Database.Error err : ItemOpp.getErrors()) {
    //                 System.debug('The following error has occurred.');                    
    //                 System.debug(err.getStatusCode() + ': ' + err.getMessage());
    //                 System.debug('Fields that affected this error: ' + err.getFields());
    //             }
    //         }
    //     }
    // }   

    // CRIAR LISTA DE ITENS DE OPP, LOOP NO CADASTRO DE PRODUTOS GERANDO ITENS DE OPP 
    // E PREENCHER OS CAMPOS NECESSÁRIOS NOS ITENS DE OPP, INSERIR OS ITENS DE OPP NA LISTA CRIADA 
    // INSERIR A LISTA DE ITENS DE OPP NO BANCO.
    // RETORNAR UMA STRING DIZENDO SE DEU CERTO.
    
    // public static void itensDeOpp(List<Opportunity> oportunidades) {
        
        
    //     for (product2 prod : produtos) {
            
    //         OpportunityLineItem item = new OpportunityLineItem();
    //         item.Product2Id = prod.Id;

    //     }



    // }

}

// @AuraEnabled
// public static List<Contact> buscarContatos() {

//     Contact[] ctts = [
//         SELECT Id, Name, Phone, Email, Title, Department, LeadSource
//         FROM Contact
//     ];

//     return ctts;
// }

// @AuraEnabled
// public static List<Opportunity> buscarOportunidades(){

//     Opportunity[] Opps = [
//         SELECT Id,
//             (
//                 SELECT Name, Id, Quantity, TotalPrice, UnitPrice
//                 FROM OpportunityLineItems
//             ),
//             (
//                 SELECT Contact.Name, Contact.Id, Contact.Email
//                 FROM OpportunityContactRoles
//             )
//         FROM Opportunity

//     ];
    
// }
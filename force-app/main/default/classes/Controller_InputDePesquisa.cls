public with sharing class Controller_InputDePesquisa {
    
    @AuraEnabled 
    public static List<Account> getAccounts(String acctName) {

        String keyString = '%'+acctName+'%';

        return [SELECT Id, Name FROM Account WHERE Name like:keyString];

    }
}
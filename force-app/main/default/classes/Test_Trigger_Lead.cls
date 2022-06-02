@isTest
public class Test_Trigger_Lead {

    @isTest
    public static void testLead() {

        Account newAcc = new Account ();
            newAcc.Name = 'Test data';
            newAcc.Email__c = 'test@gmail.com';
        insert newAcc;

        // Test.startTest();

            Lead newLead = new Lead ();
                newLead.LastName = 'Test data';
                newLead.Email_do_representante__c = 'test@gmail.com';
                newLead.Company = 'Test company';
            insert newLead;

            Lead newLead2 = new Lead ();
                newLead2.LastName = 'Test data';
                newLead2.Company = 'Test company';
            insert newLead2;

            System.assertEquals(newAcc.Id, [SELECT Representante__c 
                                            FROM Lead 
                                            WHERE Id = :newLead.Id].Representante__c);
            System.assertEquals(null, [SELECT Representante__c 
                                       FROM Lead 
                                       WHERE Id = :newLead2.Id].Representante__c);

            
                newLead.Email_do_representante__c = '';
            Database.update(newLead, false);

            
                newLead2.Email_do_representante__c = 'test@gmail.com';
            Database.update(newLead2, false);

            System.assertEquals(newAcc.Id, [SELECT Representante__c 
                                            FROM Lead 
                                            WHERE Id = :newLead.Id].Representante__c);
            System.assertEquals(newAcc.Id, [SELECT Representante__c 
                                            FROM Lead 
                                            WHERE Id = :newLead2.Id].Representante__c);

        // Test.stopTest();
    }
}
public class NewCaseListController {
    public List<Case> getNewCases() {
        List<Case> newCaseList = Database.query('Select Id,CaseNumber ' + 
                                                'From Case ' + 
                                                'Where Status=\'New\''
                                               );
        return newCaseList;
    }
}
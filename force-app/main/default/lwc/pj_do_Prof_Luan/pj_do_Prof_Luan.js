import { LightningElement, track } from 'lwc';
import buscarProdutos from '@salesforce/apex/Controller_TabelaProds.buscarProdutos';
import buscarContas from '@salesforce/apex/Controller_TabelaProds.buscarContas';
import inserirDados from '@salesforce/apex/Controller_TabelaProds.inserirDados';

export default class Pj_do_Prof_Luan extends LightningElement {
    @track contacts = [];
    @track products = [];
    @track accounts = [];
    error;
    
    connectedCallback() {
        
        buscarProdutos().then(produtos => {
            this.products = produtos;
            console.log(produtos);
        }).catch(error => {
            console.log({ error });
        });
        
        buscarContas().then(result3 => {
            this.accounts = result3;
            console.log(result3);
        }).catch(error => {
            console.log({ error });
        });        
    };
    
    @track columnsProds = [
        { label: 'Name', fieldName: 'prodName', type: 'text' },
        { label: 'Description', fieldName: 'prodDescription', type: 'text' },
        { label: 'ProductCode', fieldName: 'prodProductCode', type: 'text' },
        { label: 'Id', fieldName: 'prodId', type: 'text' },
        { label: 'Unit Price', fieldName: 'entrUnitPrice', type: 'number' },
        { label: 'Table Name', fieldName: 'entrTblName' },
    ];
            
    @track columnsAccts = [
        { label: 'Name', fieldName: 'Name', type: 'text' },
        { label: 'Phone', fieldName: 'Phone', type: 'phone' },
        { label: 'AccountNumber', fieldName: 'AccountNumber', type: 'text' },
        { label: 'Id', fieldName: 'Id', type: 'text' },
    ];

    /* track selected rows */

    @track initSelectedRowsProd = [];
    @track linhasDoProd = [];
    @track initSelectedRowsCli = [];
    @track linhasDoCli = [];
    @track inserirDados = [];

    changeTable1(event) {
        this.linhasDoProd = event?.detail?.selectedRows;
        console.log(this.linhasDoProd[0]+'salame');
    }

    changeTable2(event) {
        this.linhasDoCli = event?.detail?.selectedRows;
        console.log("salame")
    }
    
    finishAndInsert() {
        console.log(this.linhasDoCli[0]);
        console.log(this.linhasDoProd);
        
        inserirDados({
            cliente: this.linhasDoCli[0],
            produtos: this.linhasDoProd,  
        });
    }

    /* next and back */
    
    @track passoAtual = 1;
    @track passo1 = true;
    @track passo2 = false;
    @track passo3 = false;
    
    limpaPassos() {
        
        let init = 1;

        while (this[`passo${init}`] == true || this[`passo${init}`] == false) {
            
            this[`passo${init}`] = false;
            init = init + 1;
        }
            
    }

    handleBack() {
        if (this.passoAtual == 1) return null;
        this.limpaPassos();
        this.passoAtual = this.passoAtual - 1;
        this[`passo${this.passoAtual}`] = true;
        
        console.log(this.passoAtual); 
    }
    
    handleNext() {
        if (this.passoAtual == 2) {
            this.finishAndInsert();
            return null;
        }

        this.limpaPassos();
        this.passoAtual = this.passoAtual + 1;
        this[`passo${this.passoAtual}`] = true;
        
        this.initSelectedRowsProd = [];
        this.linhasDoProd.forEach(row => {
            this.initSelectedRowsProd.push(row.Id);
        });
    }
}

// import buscarOportunidades from '@salesforce/apex/Controller_TabelaProds.buscarOportunidades';

// @track oportunidades = [];

// buscarOportunidades().then(result3 => {
    //     this.oportunidades = result3;
    //     console.log(result3);
    // }).catch(error => {
        //         console.log({ error });
        //     });
        
        // buscarContatos().then(result2 => {
        //     this.contacts = result2;
        //     console.log(result2);
        // }).catch(error => {
        //     console.log({ error });
        // });

        // @track columnsOpps = [
            //     { label: 'Name', fieldName: 'Contact.Name', type: 'text' },
            //     { label: 'Phone', fieldName: 'Phone', type: 'phone' },
            //     { label: 'Type', fieldName: 'Type', type: 'text' },
            //     { label: 'Industry', fieldName: 'Industry', type: 'text' },
            //     { label: 'IsPartner', fieldName: 'IsPartner', type: 'text' },
            //     { label: 'AnnualRevenue', fieldName: 'AnnualRevenue', type: 'text' },
            //     { label: 'AccountNumber', fieldName: 'AccountNumber', type: 'text' },
//     { label: 'Id', fieldName: 'Id', type: 'text' },
// ];

// @track columnsCtts = [
    //     { label: 'Name', fieldName: 'Name', type: 'text' },
    //     { label: 'Department', fieldName: 'Department', type: 'text' },
    //     { label: 'Email', fieldName: 'Email', type: 'Email' },
    //     { label: 'Phone', fieldName: 'Phone', type: '' },
    //     { label: 'Id', fieldName: 'Id', type: 'text' },
    // ];
    
    // this.passo1 = false;
    // this.passo2 = false;
    // this.passo3 = false;
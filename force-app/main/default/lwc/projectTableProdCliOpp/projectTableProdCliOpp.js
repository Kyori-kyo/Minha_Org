import { LightningElement, track } from 'lwc';
import buscarProdutos from '@salesforce/apex/Controller_TabelaProdsClisOpps.buscarProdutos';
import buscarContas from '@salesforce/apex/Controller_TabelaProdsClisOpps.buscarContas';
import getAccountList from '@salesforce/apex/Controller_TabelaProdsClisOpps.getAccountList';
import getProductList from '@salesforce/apex/Controller_TabelaProdsClisOpps.getProductList';
import inserirDados from '@salesforce/apex/Controller_TabelaProdsClisOpps.inserirDados';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

export default class ProjectTableProdCliOpp extends LightningElement {

    @track products = [];
    @track accounts = [];
    error;
    /* ------------------ Search ----------------------- */
    searchValue = '';

    // update searchValue var when input field value change
    searchKeyword(event) {
        this.searchValue = event?.target?.value;
    }

    // Product search // call apex method on button click 
    handleSearchKeywordProds() {
        console.log({ searchValue: this.searchValue });

        if (this.searchValue == null) {
            this.searchValue = '';
        }

        // if (this.searchValue !== '') {
        getProductList({
            searchKey: this.searchValue
        }).then(result => {
            console.log({ result });
            // @track products variable with return account list from server?  
            this.products = result;
        }).catch(error => {
            console.log({ error });

            const event = new ShowToastEvent({
                title: 'Error',
                variant: 'error',
                message: error?.body?.message,
            });
            this.dispatchEvent(event);
            // reset products var with empty array   
            this.products = [];
        });
        // } else {
        //     console.log("error");

        //     // fire toast event if input field is blank
        //     const event = new ShowToastEvent({
        //         variant: 'error',
        //         message: 'Search text missing..',
        //     });
        //     this.dispatchEvent(event);
        // }
    }


    // Account search // call apex method on button click 
    handleSearchKeywordClis() {
        console.log({ searchValue: this.searchValue });

        if (this.searchValue !== '') {
            getAccountList({
                searchKey: this.searchValue
            }).then(result => {
                console.log({ result });
                // @track accounts variable with return account list from server?  
                this.accounts = result;
            }).catch(error => {
                console.log({ error });

                const event = new ShowToastEvent({
                    title: 'Error',
                    variant: 'error',
                    message: error?.body?.message,
                });
                this.dispatchEvent(event);
                // reset accounts var with empty array   
                this.accounts = [];
            });
        }// } else {
        //     console.log("error");

        //     // fire toast event if input field is blank
        //     const event = new ShowToastEvent({
        //         variant: 'error',
        //         message: 'Search text missing..',
        //     });
        //     this.dispatchEvent(event);
        // }
    }
    /* ------------------ retorna prod/cli na tabela ----------------------- */

    connectedCallback() {

        buscarProdutos().then(produtos => {
            this.products = produtos;
            console.log(produtos.length);
        }).catch(error => {
            console.log(error)
        });

        buscarContas().then(contas => {
            this.accounts = contas;
            console.log(contas.length);
        }).catch(error => {
            console.log(error)
        });

    };


    @track columnsProds = [
        { label: 'Name', fieldName: 'prodName', type: 'text' },
        { label: 'Quantity', fieldName: 'quantity', type: 'number', editable: true },
        { label: 'Id', fieldName: 'prodId', type: 'text' },
        { label: 'produtosCode', fieldName: 'prodProductsCode', type: 'text' },
        { label: 'Table Name', fieldName: 'entryTableName' },
        { label: 'Unit Price', fieldName: 'entryUnitPrice', type: 'number', editable: true },
    ];

    @track columnsAccts = [
        { label: 'Name', fieldName: 'Name', type: 'text' },
        { label: 'Phone', fieldName: 'Phone', type: 'phone' },
        { label: 'Account Number', fieldName: 'AccountNumber', type: 'text' }
    ];


    /* ------------------ Track de rows selecionadas ----------------------- */
    @track initSelectedRowsProd = [];
    @track initSelectedRowsClis = [];
    @track selectedRowsProd = [];
    @track selectedRowsClis = [];
    @track inserirDados = [];

    changeTableProd(event) {
        this.selectedRowsProd = event?.detail?.selectedRows
        console.log(this.selectedRowsProd.length);
    }

    changeTableClis(event) {
        this.selectedRowsClis = event?.detail?.selectedRows;
        console.log(this.selectedRowsClis.length);
    }

    /* ----------------------- Salvar quantidade ----------------------- */
    draftValues;
    handleSave(event) {

        this.saveDraftValues = event.detail.draftValues;

        event.detail.draftValues.forEach(item => {
            this.selectedRowsProd.forEach(selected => {
                if (item.prodId == selected.prodId) {
                    // selected['quantity'] = item.quantity;

                    for (const key in item) {
                        if (Object.hasOwnProperty.call(item, key)) {
                            const valor = item[key];

                            selected[key] = valor;
                        }
                    }
                    // selected = { ...selected, ...item };
                }
            });
        });

        this.draftValues = null;

        console.log({ draftValues: event.detail.draftValues });
        console.log({ event });
        console.log(this.selectedRowsProd);
    }


    /* ----------------------- Handle Next e Back ----------------------- */
    @track passoAtual = 1;
    @track passo1 = true;
    @track passo2 = false;

    resetPassos() {

        let init = 1;

        while (this[`passo${init}`] == true || this[`passo${init}`] == false) {
            console.log(`O init é:${init}`);
            this[`passo${init}`] = false;
            init = init + 1;
        }
    }

    handleNext() {

        if (this.passoAtual == 3) return null;
        this.resetPassos();
        this.passoAtual = this.passoAtual + 1;
        this[`passo${this.passoAtual}`] = true;
    }

    handleBack() {
        if (this.passoAtual == 1) return null;
        this.resetPassos();
        this.passoAtual = this.passoAtual - 1;
        this[`passo${this.passoAtual}`] = true;

        this.initSelectedRowsProd = [];
        this.selectedRowsProd.forEach((row) => {
            this.initSelectedRowsProd.push(row.prodId);
            console.log({ row });
        });

        console.log(this.initSelectedRowsProd);
    }


    /* ----------------------- Finish and insert ----------------------- */
    finishAndInsert() {

        console.log(this.selectedRowsClis);
        console.log(this.selectedRowsProd);

        inserirDados({

            client: this.selectedRowsClis[0],
            products: this.selectedRowsProd,
        }).then(result => {
            console.log({ result });
        }).catch(error => {
            console.log({ error });
        });
    }

    /* ----------------------- Catch data input ----------------------- */
    // @track productInfo = [];
    // @api myRecordId;

    // get acceptedFormats() {
    //     return ['.pdf', '.png'];
    // }

    // /* ----------------------- Finish and create ----------------------- */
    // handleSaveProd(cmp, event) {

    //     const inputNome = this.template.querySelector('.inputNome');
    //     console.log(inputNome.value)
    //     var value = inputNome.value;
    //     console.log(inputNome.value)
    //     // is input valid text?
    //     if (value === this.products.Name) {
    //         inputCmp.setCustomValidity('erro');
    //         console.log(value);
    //     } else {
    //         inputCmp.setCustomValidity(''); // if there was a custom error before, reset it
    //     }
    //     inputCmp.reportValidity(); // Tells lightning-input to show the error right away without needing interaction

    // }
}


// IF ( Text(Fdbk_Decisao_da_compra__c) = "Sim", 6, 
// IF ( Text(Fdbk_Decisao_da_compra__c) = "Nao", 0, 3))
// +
// IF ( Text( Fdbk_Grau_de_interesse__c ) = "Baixo", 0,
// IF ( Text( Fdbk_Grau_de_interesse__c ) = "Medio", 2, 
// IF ( Text( Fdbk_Grau_de_interesse__c ) = "Alto", 4, 6 )))
// +
// IF ( Text( Fdbk_Poder_Financeiro__c ) = "Faria a compra tranquilamente", 6,
// IF ( Text( Fdbk_Poder_Financeiro__c ) = "Pode fazer a compra", 5,
// IF ( Text( Fdbk_Poder_Financeiro__c ) = "Faria a compra mas teria que estudar", 2,
// IF ( Text( Fdbk_Poder_Financeiro__c ) = "Dificilmente poderia comprar", 0, -2))))
// +
// IF ( Text( Fdbk_Poder_Financeiro__c ) = "1 a 6 meses", 10,
// IF ( Text( Fdbk_Poder_Financeiro__c ) = "6 meses a 1 ano", 8,
// IF ( Text( Fdbk_Poder_Financeiro__c ) = "De 1 a 2 anos", 3,
// IF ( Text( Fdbk_Poder_Financeiro__c ) = "Mais de 2 anos", 0, -5))))
// +
// IF ( Text(  Fdbk_Observacoes_do_vendedor__c  ) = "Aberta", 0, 0)

// IF (  Text( SegEmp__c ) = "Indúsria de papel e celulose", 1, 0)
// +
// IF (  Text( TipMer__c ) = "I - Interno", 1, 0)
// +
// IF (  Text( TamEmp__c ) = "0 a 100", -3, 
// IF (  Text( TamEmp__c ) = "101 a 300", 1, 
// IF (  Text( TamEmp__c ) = "301 a 1000", 2,
// IF (  Text( TamEmp__c ) = "2001 +", 3,
// IF (  Text( TamEmp__c ) = "1001 a 2000", 3, ""
// ))))

// IF (  Calculo_de_Peso_do_Lead__c <= 0, "Frio",
//     IF (  Calculo_de_Peso_do_Lead__c = 1, "Morno",
//     IF (  Calculo_de_Peso_do_Lead__c > 1, "Quente",
//     IF (  Calculo_de_Peso_do_Lead__c >= 4, "Muito quente", ""))))

/*
<template>
    <lightning-card 
        title="File Upload Demo LWC" 
        icon-name="custom:custom14">

        <div 
            class="slds-m-around_medium"> 
                <lightning-input 
                    type="file" 
                    accept=".xlsx, .xls, .csv, .png, .doc, .docx, .pdf" 
                    label="Attachment" 
                    onchange={openfileUpload}>
                </lightning-input> 
        </div> 

        <template if:true={fileData}> 
            <p>{fileData.filename}</p> 
        </template> 
        
        <lightning-button 
            variant="brand" 
            label="submit" 
            title="Submit" 
            onclick={handleClick} 
            class="slds-m-left_x-small">
        </lightning-button> 

    </lightning-card> 
</template> 
*/
import { LightningElement, track, api } from 'lwc';
import getProductList from '@salesforce/apex/Controller_TabelaProdsClisOpps.getProductList';
import buscarProdutos from '@salesforce/apex/Controller_TabelaProdsClisOpps.buscarProdutos';
import getAccountList from '@salesforce/apex/Controller_TabelaProdsClisOpps.getAccountList';
import buscarContas from '@salesforce/apex/Controller_TabelaProdsClisOpps.buscarContas';
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

        getProductList({
            searchKey: this.searchValue,

        }).then(result => {
            console.log({ result });
            this.products = result;

        }).catch(error => {
            console.log({ error });

            const event = new ShowToastEvent({
                title: 'Error',
                variant: 'error',
                message: error?.body?.message,

            });
            this.dispatchEvent(event);
            this.products = [];
        });
    }


    // Account search // call apex method on button click 
    handleSearchKeywordClis() {

        console.log({ searchValue: this.searchValue });

        if (this.searchValue !== '') {

            getAccountList({
                searchKey: this.searchValue

            }).then(result => {
                console.log({ result });
                this.accounts = result;

            }).catch(error => {
                console.log({ error });

                const event = new ShowToastEvent({
                    title: 'Error',
                    variant: 'error',
                    message: error?.body?.message,

                });
                this.dispatchEvent(event);
                this.accounts = [];

            });
        }
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

                    for (const key in item) {

                        if (Object.hasOwnProperty.call(item, key)) {
                            const valor = item[key];
                            selected[key] = valor;

                        }
                    }
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
    @track disableFinishAndInsert = false;

    finishAndInsert() {
        this.disableFinishAndInsert = true;

        if (this.disableFinishAndInsert == false) {

            let listaDeError = [];

            this.selectedRowsProd.forEach(prod => {
                if (prod.quantity <= 0) {
                    listaDeError.push(prod);
                }
            });

            if (listaDeError.length > 0) {
                alert('deu erro!');

                listaDeError.forEach(prod => {
                    console.log({ prod });
                });

            } else {


                inserirDados({
                    client: this.selectedRowsClis[0],
                    products: this.selectedRowsProd,

                }).then(result => {
                    console.log({ result });

                }).catch(error => {
                    console.log({ error });

                });
            }

        }
        console.log('sabão')
        this.disableFinishAndInsert = false;
    }
}
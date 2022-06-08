import { LightningElement, track } from 'lwc';
import buscaCotacoes from '@salesforce/apex/Controller_CotacaoDiaria.buscaCotacoes';

export default class CotacaoDiaria extends LightningElement {

    @track mapName = {};
    @track resultMoeda = {};

    @track usdBid = "...";
    @track usdClass = "dolar ";
    @track usdPctChange = "..."

    @track eurBid = "...";
    @track eurClass = "euro ";
    @track eurPctChange = "..."

    @track btcBid = "...";
    @track btcClass = "bitcoin ";
    @track btcPctChange = "..."

    @track timeVar = "..."
    error;

    connectedCallback() {
        this.buscarCotacoes();
    };

    @track desabilitarBuscarCotacoes = false;
    buscarCotacoes() {
        if (this.desabilitarBuscarCotacoes == false) {
            this.desabilitarBuscarCotacoes = true;

            console.log(`Resultado das cotações de hoje: ${this.eurBid}`)
            buscaCotacoes().then(cotacao => {

                this.resultMoeda = cotacao;
                console.log(cotacao);

                this.usdBid = "" + cotacao.USDBRL['bid'];
                this.usdPctChange = "" + cotacao.USDBRL['pctChange'];

                this.eurBid = "" + cotacao.EURBRL['bid'];
                this.eurPctChange = "" + cotacao.EURBRL['pctChange'];

                this.btcBid = "" + cotacao.BTCBRL['bid'];
                this.btcPctChange = "" + cotacao.BTCBRL['pctChange'];

                this.timeVar = "" + cotacao.USDBRL['create_date']

                console.log(this.usdBid);

                this.usdClass = `dolar moeda ${(this.usdPctChange).includes("-") ? 'negativo' : 'positivo'}`;
                this.eurClass = `euro moeda ${(this.eurPctChange).includes("-") ? 'negativo' : 'positivo'}`;
                this.btcClass = `bitcoin moeda ${(this.btcPctChange).includes("-") ? 'negativo' : 'positivo'}`;

                this.desabilitarBuscarCotacoes = false;

            }).catch(error => {
                console.log(error);

                this.desabilitarBuscarCotacoes = false;
            });
        }
    }

}
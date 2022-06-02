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

            this.usdClass = `dolar ${(this.usdPctChange).includes("-") ? 'negativo' : 'positivo'}`;
            this.eurClass = `euro ${(this.eurPctChange).includes("-") ? 'negativo' : 'positivo'}`;
            this.btcClass = `bitcoin ${(this.btcPctChange).includes("-") ? 'negativo' : 'positivo'}`;

        }).catch(error => {
            console.log(error)
        });
    };

    handleRecarregar() {

        this.connectedCallback();
    };
}
import { LightningElement, track } from 'lwc';

export default class WebToLeadTeste extends LightningElement {

    @track arigato = false;
    refreshPage(event) {
        event.preventDefault();
        this.arigato = true;
    }
}
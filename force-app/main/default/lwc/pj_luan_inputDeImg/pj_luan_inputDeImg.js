import { LightningElement, track, api } from 'lwc';
import createProduct from '@salesforce/apex/pj_luan_inputDeImg.createProduct';
export default class Pj_luan_inputDeImg extends LightningElement {

    @track inputNome = "";
    @track inputPrice = "";
    @track inputQuantity = "";
    @api recordId;


    inputChange(event) {

        this[event.target.name] = event?.target?.value;
        console.log(`O valor mudado de ${event.target.name} é: ${this[event.target.name]}`);

    }

    handleSave() {

        // if (this.inputNome != '' && this.inputQuantity != '') {

        //     for (const key in item) {
        //         if (Object.hasOwnProperty.call(item, key)) {
        //             const valor = item[key];

        //             selected[key] = valor;
        //         }
        //     }
        //     // selected = { ...selected, ...item };
        // }
        createProduct({

            nomeProd: this.inputNome,
            precoProd: this.inputPrice,
            qtdProd: this.inputQuantity,
            idOpp: this.recordId,

        }).then(result => {

            if (result == 'Sucesso! O Produto foi criado com sucesso.') {
                console.log('salvou');

            } else {
                console.log(result);

            }
        }).catch(error => {
            console.log(error)

        });
    }
}
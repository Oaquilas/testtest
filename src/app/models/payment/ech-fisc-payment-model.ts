import { Echfisc } from './echfisc';
import { EchfiscDPaymentModel } from './echfisc-dpayment-model';

export class EchFiscPaymentModel {
    echfisc: Echfisc;
    libl: string;
    echfiscDPaymentModels = new Array<EchfiscDPaymentModel>();
}

import { Cptefisc } from './cptefisc';
import { EchFiscPaymentModel } from './ech-fisc-payment-model';

export class SituationFiscale {
    cptefisc: Cptefisc;
    echfiscPaymentModels = new Array<EchFiscPaymentModel>();
}

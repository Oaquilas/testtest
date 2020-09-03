import { Transact } from './transact';
import { TransactEchFiscPaymentModel } from './transact-ech-fisc-payment-model';

export class TransactModelPayment {
    transact: Transact;
    transactEchFiscPaymentModelList = new Array<TransactEchFiscPaymentModel>();
}

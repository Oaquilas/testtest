import { TransactEchFisc } from './transact-ech-fisc';
import { TransactEchFiscDPaymentModel } from './transact-ech-fisc-dpayment-model';

export class TransactEchFiscPaymentModel {
    transactEchFisc: TransactEchFisc;
    transactEchFiscDPaymentModels = new Array<TransactEchFiscDPaymentModel>();
}

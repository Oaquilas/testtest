import { EchfiscTransactModel } from '../payment/echfisc-transact-model';
import {EchfiscTransactDModel} from '../payment/echfisc-transact-dmodel';
export class DetailUIModel {
    echfiscmodelA: EchfiscTransactModel;
    echfiscmodelB = new Array<EchfiscTransactDModel>();
    constructor() {}

}

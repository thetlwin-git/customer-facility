import { Pipe, PipeTransform } from '@angular/core';
import { ILoanPayment } from 'src/app/entities/facility/model/loan-payment.model';

@Pipe({
  name: 'transaction'
})
export class TransactionPipe implements PipeTransform {

  transform(items: ILoanPayment[], filter: any): any {
    if (!items || !filter) {
      return items;
    }

    return items.filter(item => item.status?.code != filter.status && item.loan?.id == filter.loanId);
  }

}

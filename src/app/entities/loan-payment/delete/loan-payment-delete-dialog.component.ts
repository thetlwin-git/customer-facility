import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILoanPayment } from '../loan-payment.model';
import { LoanPaymentService } from '../service/loan-payment.service';

@Component({
  templateUrl: './loan-payment-delete-dialog.component.html',
})
export class LoanPaymentDeleteDialogComponent {
  loanPayment?: ILoanPayment;

  constructor(protected loanPaymentService: LoanPaymentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.loanPaymentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

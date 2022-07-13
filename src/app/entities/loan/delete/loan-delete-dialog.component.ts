import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILoan } from '../loan.model';
import { LoanService } from '../service/loan.service';

@Component({
  templateUrl: './loan-delete-dialog.component.html',
})
export class LoanDeleteDialogComponent {
  loan?: ILoan;

  constructor(protected loanService: LoanService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.loanService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILoanType } from '../loan-type.model';
import { LoanTypeService } from '../service/loan-type.service';

@Component({
  templateUrl: './loan-type-delete-dialog.component.html',
})
export class LoanTypeDeleteDialogComponent {
  loanType?: ILoanType;

  constructor(protected loanTypeService: LoanTypeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.loanTypeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICreditFacilityLoanLimit } from '../credit-facility-loan-limit.model';
import { CreditFacilityLoanLimitService } from '../service/credit-facility-loan-limit.service';

@Component({
  templateUrl: './credit-facility-loan-limit-delete-dialog.component.html',
})
export class CreditFacilityLoanLimitDeleteDialogComponent {
  creditFacilityLoanLimit?: ICreditFacilityLoanLimit;

  constructor(protected creditFacilityLoanLimitService: CreditFacilityLoanLimitService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.creditFacilityLoanLimitService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

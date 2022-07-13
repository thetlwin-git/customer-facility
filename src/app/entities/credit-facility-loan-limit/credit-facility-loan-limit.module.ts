import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreditFacilityLoanLimitComponent } from './list/credit-facility-loan-limit.component';
import { CreditFacilityLoanLimitDetailComponent } from './detail/credit-facility-loan-limit-detail.component';
import { CreditFacilityLoanLimitUpdateComponent } from './update/credit-facility-loan-limit-update.component';
import { CreditFacilityLoanLimitDeleteDialogComponent } from './delete/credit-facility-loan-limit-delete-dialog.component';
import { CreditFacilityLoanLimitRoutingModule } from './route/credit-facility-loan-limit-routing.module';

@NgModule({
  imports: [SharedModule, CreditFacilityLoanLimitRoutingModule],
  declarations: [
    CreditFacilityLoanLimitComponent,
    CreditFacilityLoanLimitDetailComponent,
    CreditFacilityLoanLimitUpdateComponent,
    CreditFacilityLoanLimitDeleteDialogComponent,
  ],
  entryComponents: [CreditFacilityLoanLimitDeleteDialogComponent],
})
export class CreditFacilityLoanLimitModule {}

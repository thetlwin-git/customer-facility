import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoanPaymentComponent } from './list/loan-payment.component';
import { LoanPaymentDetailComponent } from './detail/loan-payment-detail.component';
import { LoanPaymentUpdateComponent } from './update/loan-payment-update.component';
import { LoanPaymentDeleteDialogComponent } from './delete/loan-payment-delete-dialog.component';
import { LoanPaymentRoutingModule } from './route/loan-payment-routing.module';

@NgModule({
  imports: [SharedModule, LoanPaymentRoutingModule],
  declarations: [LoanPaymentComponent, LoanPaymentDetailComponent, LoanPaymentUpdateComponent, LoanPaymentDeleteDialogComponent],
  entryComponents: [LoanPaymentDeleteDialogComponent],
})
export class LoanPaymentModule {}

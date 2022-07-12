import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoanTypeComponent } from './list/loan-type.component';
import { LoanTypeDetailComponent } from './detail/loan-type-detail.component';
import { LoanTypeUpdateComponent } from './update/loan-type-update.component';
import { LoanTypeDeleteDialogComponent } from './delete/loan-type-delete-dialog.component';
import { LoanTypeRoutingModule } from './route/loan-type-routing.module';

@NgModule({
  imports: [SharedModule, LoanTypeRoutingModule],
  declarations: [LoanTypeComponent, LoanTypeDetailComponent, LoanTypeUpdateComponent, LoanTypeDeleteDialogComponent],
  entryComponents: [LoanTypeDeleteDialogComponent],
})
export class LoanTypeModule {}

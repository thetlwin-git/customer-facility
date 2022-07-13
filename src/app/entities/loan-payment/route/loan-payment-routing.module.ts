import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'src/app/core/auth/user-route-access.service';
import { LoanPaymentComponent } from '../list/loan-payment.component';
import { LoanPaymentDetailComponent } from '../detail/loan-payment-detail.component';
import { LoanPaymentUpdateComponent } from '../update/loan-payment-update.component';
import { LoanPaymentRoutingResolveService } from './loan-payment-routing-resolve.service';

const loanPaymentRoute: Routes = [
  {
    path: '',
    component: LoanPaymentComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LoanPaymentDetailComponent,
    resolve: {
      loanPayment: LoanPaymentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LoanPaymentUpdateComponent,
    resolve: {
      loanPayment: LoanPaymentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LoanPaymentUpdateComponent,
    resolve: {
      loanPayment: LoanPaymentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(loanPaymentRoute)],
  exports: [RouterModule],
})
export class LoanPaymentRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'src/app/core/auth/user-route-access.service';
import { CreditFacilityLoanLimitComponent } from '../list/credit-facility-loan-limit.component';
import { CreditFacilityLoanLimitDetailComponent } from '../detail/credit-facility-loan-limit-detail.component';
import { CreditFacilityLoanLimitUpdateComponent } from '../update/credit-facility-loan-limit-update.component';
import { CreditFacilityLoanLimitRoutingResolveService } from './credit-facility-loan-limit-routing-resolve.service';

const creditFacilityLoanLimitRoute: Routes = [
  {
    path: '',
    component: CreditFacilityLoanLimitComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CreditFacilityLoanLimitDetailComponent,
    resolve: {
      creditFacilityLoanLimit: CreditFacilityLoanLimitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CreditFacilityLoanLimitUpdateComponent,
    resolve: {
      creditFacilityLoanLimit: CreditFacilityLoanLimitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CreditFacilityLoanLimitUpdateComponent,
    resolve: {
      creditFacilityLoanLimit: CreditFacilityLoanLimitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(creditFacilityLoanLimitRoute)],
  exports: [RouterModule],
})
export class CreditFacilityLoanLimitRoutingModule {}

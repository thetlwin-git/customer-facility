import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'src/app/core/auth/user-route-access.service';
import { LoanTypeComponent } from '../list/loan-type.component';
import { LoanTypeDetailComponent } from '../detail/loan-type-detail.component';
import { LoanTypeUpdateComponent } from '../update/loan-type-update.component';
import { LoanTypeRoutingResolveService } from './loan-type-routing-resolve.service';

const loanTypeRoute: Routes = [
  {
    path: '',
    component: LoanTypeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LoanTypeDetailComponent,
    resolve: {
      loanType: LoanTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LoanTypeUpdateComponent,
    resolve: {
      loanType: LoanTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LoanTypeUpdateComponent,
    resolve: {
      loanType: LoanTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(loanTypeRoute)],
  exports: [RouterModule],
})
export class LoanTypeRoutingModule {}

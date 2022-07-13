import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'src/app/core/auth/user-route-access.service';
import { LoanComponent } from '../list/loan.component';
import { LoanDetailComponent } from '../detail/loan-detail.component';
import { LoanUpdateComponent } from '../update/loan-update.component';
import { LoanRoutingResolveService } from './loan-routing-resolve.service';

const loanRoute: Routes = [
  {
    path: '',
    component: LoanComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LoanDetailComponent,
    resolve: {
      loan: LoanRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LoanUpdateComponent,
    resolve: {
      loan: LoanRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LoanUpdateComponent,
    resolve: {
      loan: LoanRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(loanRoute)],
  exports: [RouterModule],
})
export class LoanRoutingModule {}

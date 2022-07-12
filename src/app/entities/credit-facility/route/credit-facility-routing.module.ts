import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'src/app/core/auth/user-route-access.service';
import { CreditFacilityComponent } from '../list/credit-facility.component';
import { CreditFacilityDetailComponent } from '../detail/credit-facility-detail.component';
import { CreditFacilityUpdateComponent } from '../update/credit-facility-update.component';
import { CreditFacilityRoutingResolveService } from './credit-facility-routing-resolve.service';

const creditFacilityRoute: Routes = [
  {
    path: '',
    component: CreditFacilityComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CreditFacilityDetailComponent,
    resolve: {
      creditFacility: CreditFacilityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CreditFacilityUpdateComponent,
    resolve: {
      creditFacility: CreditFacilityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CreditFacilityUpdateComponent,
    resolve: {
      creditFacility: CreditFacilityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(creditFacilityRoute)],
  exports: [RouterModule],
})
export class CreditFacilityRoutingModule {}

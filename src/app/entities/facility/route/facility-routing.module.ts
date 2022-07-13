import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'src/app/core/auth/user-route-access.service';
import { FacilityComponent } from '../list/facility.component';

const facilityRoute: Routes = [
  {
    path: '',
    component: FacilityComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  } 
];

@NgModule({
  imports: [RouterModule.forChild(facilityRoute)],
  exports: [RouterModule],
})
export class FacilityRoutingModule {}

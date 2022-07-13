import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FacilityComponent } from './list/facility.component';
import { FacilityRoutingModule } from './route/facility-routing.module';

@NgModule({
  imports: [SharedModule, FacilityRoutingModule],
  declarations: [FacilityComponent],
})
export class FacilityModule {}

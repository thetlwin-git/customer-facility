import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICreditFacility, CreditFacility } from '../credit-facility.model';
import { CreditFacilityService } from '../service/credit-facility.service';

@Injectable({ providedIn: 'root' })
export class CreditFacilityRoutingResolveService implements Resolve<ICreditFacility> {
  constructor(protected service: CreditFacilityService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICreditFacility> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((creditFacility: HttpResponse<CreditFacility>) => {
          if (creditFacility.body) {
            return of(creditFacility.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CreditFacility());
  }
}

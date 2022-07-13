import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICreditFacilityLoanLimit, CreditFacilityLoanLimit } from '../credit-facility-loan-limit.model';
import { CreditFacilityLoanLimitService } from '../service/credit-facility-loan-limit.service';

@Injectable({ providedIn: 'root' })
export class CreditFacilityLoanLimitRoutingResolveService implements Resolve<ICreditFacilityLoanLimit> {
  constructor(protected service: CreditFacilityLoanLimitService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICreditFacilityLoanLimit> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((creditFacilityLoanLimit: HttpResponse<CreditFacilityLoanLimit>) => {
          if (creditFacilityLoanLimit.body) {
            return of(creditFacilityLoanLimit.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CreditFacilityLoanLimit());
  }
}

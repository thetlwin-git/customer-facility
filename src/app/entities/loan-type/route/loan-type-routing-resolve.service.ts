import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILoanType, LoanType } from '../loan-type.model';
import { LoanTypeService } from '../service/loan-type.service';

@Injectable({ providedIn: 'root' })
export class LoanTypeRoutingResolveService implements Resolve<ILoanType> {
  constructor(protected service: LoanTypeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILoanType> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((loanType: HttpResponse<LoanType>) => {
          if (loanType.body) {
            return of(loanType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new LoanType());
  }
}

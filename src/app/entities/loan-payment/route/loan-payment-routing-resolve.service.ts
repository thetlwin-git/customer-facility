import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILoanPayment, LoanPayment } from '../loan-payment.model';
import { LoanPaymentService } from '../service/loan-payment.service';

@Injectable({ providedIn: 'root' })
export class LoanPaymentRoutingResolveService implements Resolve<ILoanPayment> {
  constructor(protected service: LoanPaymentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILoanPayment> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((loanPayment: HttpResponse<LoanPayment>) => {
          if (loanPayment.body) {
            return of(loanPayment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new LoanPayment());
  }
}

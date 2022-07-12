import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICreditFacilityLoanLimit } from '../credit-facility-loan-limit.model';

@Component({
  selector: 'jhi-credit-facility-loan-limit-detail',
  templateUrl: './credit-facility-loan-limit-detail.component.html',
})
export class CreditFacilityLoanLimitDetailComponent implements OnInit {
  creditFacilityLoanLimit: ICreditFacilityLoanLimit | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ creditFacilityLoanLimit }) => {
      this.creditFacilityLoanLimit = creditFacilityLoanLimit;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

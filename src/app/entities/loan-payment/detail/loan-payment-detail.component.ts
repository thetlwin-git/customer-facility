import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILoanPayment } from '../loan-payment.model';

@Component({
  selector: 'app-loan-payment-detail',
  templateUrl: './loan-payment-detail.component.html',
})
export class LoanPaymentDetailComponent implements OnInit {
  loanPayment: ILoanPayment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loanPayment }) => {
      this.loanPayment = loanPayment;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILoanType } from '../loan-type.model';

@Component({
  selector: 'jhi-loan-type-detail',
  templateUrl: './loan-type-detail.component.html',
})
export class LoanTypeDetailComponent implements OnInit {
  loanType: ILoanType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loanType }) => {
      this.loanType = loanType;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILoan } from '../model/loan.model';
import { ILoanPayment, getLoanPaymentIdentifier } from '../model/loan-payment.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'src/app/config/pagination.constants';
import { FacilityService } from '../service/facility.service';
import { LoanPaymentService } from '../service/loan-payment.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
})
export class FacilityComponent implements OnInit {
  loans?: ILoan[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  public isCollapsed = true;

  //Loan Payments
  loanPayments?: ILoanPayment[];
  isLoadingLP = false;
  totalItemsLP = 0;
  itemsPerPageLP = ITEMS_PER_PAGE;
  pageLP?: number;
  predicateLP!: string;
  ascendingLP!: boolean;
  ngbPaginationPageLP = 1;

  constructor(
    protected facilityService: FacilityService,
    protected loanPaymentService: LoanPaymentService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) { }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.facilityService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<ILoan[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });
  }

  loadLP(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.loanPaymentService
      .query({
        page: 0,
        size: this.itemsPerPage,
        // sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<ILoanPayment[]>) => {
          this.isLoading = false;
          this.onSuccessLP(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  trackId(_index: number, item: ILoan): number {
    return item.id!;
  }

  trackIdLP(_index: number, item: ILoanPayment): number {
    return item.id!;
  }

  onSubmit(data: any): void {
    // alert("Submit : " + JSON.stringify(data));
    console.log('on submit')
    const postData: any = {
      amount: data.amount,
      loanId: data.loanId
    };
    this.subscribeToSaveResponse(this.facilityService.makePayment(postData));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILoanPayment>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    // this.previousState();
    const page = 1;
    const pageNumber = +(page ?? 1);
    const sort = 'id,asc';
    const predicate = sort[0];
    const ascending = sort[1] === ASC;

    this.predicate = predicate;
    this.ascending = ascending;

    this.loadPage(pageNumber, true);
    this.loadLP(pageNumber, true);
  }

  protected onSaveError(): void {
    console.log('save error');
  }

  protected onSaveFinalize(): void {
    // this.isSaving = false;
    console.log('save finalize');
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }

    return result;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = +(page ?? 1);
      const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === ASC;
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
        this.loadLP(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: ILoan[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/facility'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.loans = data ?? [];
    this.loans.forEach(x => {
      x.paymentCollpse = true;
      x.tranCollpse = true;
    });
    this.ngbPaginationPage = this.page;
  }

  protected onSuccessLP(data: ILoanPayment[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItemsLP = Number(headers.get('X-Total-Count'));
    this.pageLP = page;
    if (navigate) {
      this.router.navigate(['/facility'], {
        queryParams: {
          page: this.pageLP,
          size: this.itemsPerPageLP,
          sort: this.predicateLP + ',' + (this.ascendingLP ? ASC : DESC),
        },
      });
    }
    this.loanPayments = data ?? [];
    this.ngbPaginationPageLP = this.pageLP;

    console.log('loanPayments', this.loanPayments)
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}

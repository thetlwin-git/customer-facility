import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILoan, Loan } from '../loan.model';
import { LoanService } from '../service/loan.service';
import { ICurrency } from 'src/app/entities/currency/currency.model';
import { CurrencyService } from 'src/app/entities/currency/service/currency.service';
import { ICreditFacility } from 'src/app/entities/credit-facility/credit-facility.model';
import { CreditFacilityService } from 'src/app/entities/credit-facility/service/credit-facility.service';
import { ILoanType } from 'src/app/entities/loan-type/loan-type.model';
import { LoanTypeService } from 'src/app/entities/loan-type/service/loan-type.service';
import { Status } from 'src/app/entities/enumerations/status.model';

@Component({
  selector: 'app-loan-update',
  templateUrl: './loan-update.component.html',
})
export class LoanUpdateComponent implements OnInit {
  isSaving = false;
  statusValues = Object.keys(Status);

  currenciesSharedCollection: ICurrency[] = [];
  creditFacilitiesSharedCollection: ICreditFacility[] = [];
  loanTypesSharedCollection: ILoanType[] = [];

  editForm = this.fb.group({
    id: [],
    amount: [null, [Validators.required]],
    startDate: [null, [Validators.required]],
    endDate: [],
    interestRate: [null, [Validators.required]],
    interestAmount: [null, [Validators.required]],
    totalPaymentAmount: [null, [Validators.required]],
    remainingAmount: [null, [Validators.required]],
    status: [null, [Validators.required]],
    editedBy: [],
    editedOn: [],
    createdBy: [],
    createdOn: [],
    currency: [],
    facility: [],
    loanType: [],
  });

  constructor(
    protected loanService: LoanService,
    protected currencyService: CurrencyService,
    protected creditFacilityService: CreditFacilityService,
    protected loanTypeService: LoanTypeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loan }) => {
      this.updateForm(loan);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const loan = this.createFromForm();
    if (loan.id !== undefined) {
      this.subscribeToSaveResponse(this.loanService.update(loan));
    } else {
      this.subscribeToSaveResponse(this.loanService.create(loan));
    }
  }

  trackCurrencyById(_index: number, item: ICurrency): number {
    return item.id!;
  }

  trackCreditFacilityById(_index: number, item: ICreditFacility): number {
    return item.id!;
  }

  trackLoanTypeById(_index: number, item: ILoanType): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILoan>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(loan: ILoan): void {
    this.editForm.patchValue({
      id: loan.id,
      amount: loan.amount,
      startDate: loan.startDate,
      endDate: loan.endDate,
      interestRate: loan.interestRate,
      interestAmount: loan.interestAmount,
      totalPaymentAmount: loan.totalPaymentAmount,
      remainingAmount: loan.remainingAmount,
      status: loan.status,
      editedBy: loan.editedBy,
      editedOn: loan.editedOn,
      createdBy: loan.createdBy,
      createdOn: loan.createdOn,
      currency: loan.currency,
      facility: loan.facility,
      loanType: loan.loanType,
    });

    this.currenciesSharedCollection = this.currencyService.addCurrencyToCollectionIfMissing(this.currenciesSharedCollection, loan.currency);
    this.creditFacilitiesSharedCollection = this.creditFacilityService.addCreditFacilityToCollectionIfMissing(
      this.creditFacilitiesSharedCollection,
      loan.facility
    );
    this.loanTypesSharedCollection = this.loanTypeService.addLoanTypeToCollectionIfMissing(this.loanTypesSharedCollection, loan.loanType);
  }

  protected loadRelationshipsOptions(): void {
    this.currencyService
      .query()
      .pipe(map((res: HttpResponse<ICurrency[]>) => res.body ?? []))
      .pipe(
        map((currencies: ICurrency[]) =>
          this.currencyService.addCurrencyToCollectionIfMissing(currencies, this.editForm.get('currency')!.value)
        )
      )
      .subscribe((currencies: ICurrency[]) => (this.currenciesSharedCollection = currencies));

    this.creditFacilityService
      .query()
      .pipe(map((res: HttpResponse<ICreditFacility[]>) => res.body ?? []))
      .pipe(
        map((creditFacilities: ICreditFacility[]) =>
          this.creditFacilityService.addCreditFacilityToCollectionIfMissing(creditFacilities, this.editForm.get('facility')!.value)
        )
      )
      .subscribe((creditFacilities: ICreditFacility[]) => (this.creditFacilitiesSharedCollection = creditFacilities));

    this.loanTypeService
      .query()
      .pipe(map((res: HttpResponse<ILoanType[]>) => res.body ?? []))
      .pipe(
        map((loanTypes: ILoanType[]) =>
          this.loanTypeService.addLoanTypeToCollectionIfMissing(loanTypes, this.editForm.get('loanType')!.value)
        )
      )
      .subscribe((loanTypes: ILoanType[]) => (this.loanTypesSharedCollection = loanTypes));
  }

  protected createFromForm(): ILoan {
    return {
      ...new Loan(),
      id: this.editForm.get(['id'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      startDate: this.editForm.get(['startDate'])!.value,
      endDate: this.editForm.get(['endDate'])!.value,
      interestRate: this.editForm.get(['interestRate'])!.value,
      interestAmount: this.editForm.get(['interestAmount'])!.value,
      totalPaymentAmount: this.editForm.get(['totalPaymentAmount'])!.value,
      remainingAmount: this.editForm.get(['remainingAmount'])!.value,
      status: this.editForm.get(['status'])!.value,
      editedBy: this.editForm.get(['editedBy'])!.value,
      editedOn: this.editForm.get(['editedOn'])!.value,
      createdBy: this.editForm.get(['createdBy'])!.value,
      createdOn: this.editForm.get(['createdOn'])!.value,
      currency: this.editForm.get(['currency'])!.value,
      facility: this.editForm.get(['facility'])!.value,
      loanType: this.editForm.get(['loanType'])!.value,
    };
  }
}

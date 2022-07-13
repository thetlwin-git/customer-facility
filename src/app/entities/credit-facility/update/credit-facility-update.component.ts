import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICreditFacility, CreditFacility } from '../credit-facility.model';
import { CreditFacilityService } from '../service/credit-facility.service';
import { IApplicant } from 'src/app/entities/applicant/applicant.model';
import { ApplicantService } from 'src/app/entities/applicant/service/applicant.service';
import { ICreditFacilityLoanLimit } from 'src/app/entities/credit-facility-loan-limit/credit-facility-loan-limit.model';
import { CreditFacilityLoanLimitService } from 'src/app/entities/credit-facility-loan-limit/service/credit-facility-loan-limit.service';
import { ICurrency } from 'src/app/entities/currency/currency.model';
import { CurrencyService } from 'src/app/entities/currency/service/currency.service';
import { Status } from 'src/app/entities/enumerations/status.model';

@Component({
  selector: 'app-credit-facility-update',
  templateUrl: './credit-facility-update.component.html',
})
export class CreditFacilityUpdateComponent implements OnInit {
  isSaving = false;
  statusValues = Object.keys(Status);

  applicantsCollection: IApplicant[] = [];
  creditFacilityLoanLimitsSharedCollection: ICreditFacilityLoanLimit[] = [];
  currenciesSharedCollection: ICurrency[] = [];

  editForm = this.fb.group({
    id: [],
    totalLimit: [null, [Validators.required]],
    availableLimit: [null, [Validators.required]],
    startDate: [null, [Validators.required]],
    endDate: [],
    status: [null, [Validators.required]],
    editedBy: [],
    editedOn: [],
    createdBy: [],
    createdOn: [],
    applicant: [],
    creditFacilityLoanLimit: [],
    currency: [],
  });

  constructor(
    protected creditFacilityService: CreditFacilityService,
    protected applicantService: ApplicantService,
    protected creditFacilityLoanLimitService: CreditFacilityLoanLimitService,
    protected currencyService: CurrencyService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ creditFacility }) => {
      this.updateForm(creditFacility);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const creditFacility = this.createFromForm();
    if (creditFacility.id !== undefined) {
      this.subscribeToSaveResponse(this.creditFacilityService.update(creditFacility));
    } else {
      this.subscribeToSaveResponse(this.creditFacilityService.create(creditFacility));
    }
  }

  trackApplicantById(_index: number, item: IApplicant): number {
    return item.id!;
  }

  trackCreditFacilityLoanLimitById(_index: number, item: ICreditFacilityLoanLimit): number {
    return item.id!;
  }

  trackCurrencyById(_index: number, item: ICurrency): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICreditFacility>>): void {
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

  protected updateForm(creditFacility: ICreditFacility): void {
    this.editForm.patchValue({
      id: creditFacility.id || null,
      totalLimit: creditFacility.totalLimit,
      availableLimit: creditFacility.availableLimit,
      startDate: creditFacility.startDate,
      endDate: creditFacility.endDate,
      status: creditFacility.status,
      editedBy: creditFacility.editedBy,
      editedOn: creditFacility.editedOn,
      createdBy: creditFacility.createdBy,
      createdOn: creditFacility.createdOn,
      applicant: creditFacility.applicant,
      creditFacilityLoanLimit: creditFacility.creditFacilityLoanLimit,
      currency: creditFacility.currency,
    });

    this.applicantsCollection = this.applicantService.addApplicantToCollectionIfMissing(
      this.applicantsCollection,
      creditFacility.applicant
    );
    this.creditFacilityLoanLimitsSharedCollection = this.creditFacilityLoanLimitService.addCreditFacilityLoanLimitToCollectionIfMissing(
      this.creditFacilityLoanLimitsSharedCollection,
      creditFacility.creditFacilityLoanLimit
    );
    this.currenciesSharedCollection = this.currencyService.addCurrencyToCollectionIfMissing(
      this.currenciesSharedCollection,
      creditFacility.currency
    );
  }

  protected loadRelationshipsOptions(): void {
    this.applicantService
      .query({ filter: 'creditfacility-is-null' })
      .pipe(map((res: HttpResponse<IApplicant[]>) => res.body ?? []))
      .pipe(
        map((applicants: IApplicant[]) =>
          this.applicantService.addApplicantToCollectionIfMissing(applicants, this.editForm.get('applicant')!.value)
        )
      )
      .subscribe((applicants: IApplicant[]) => (this.applicantsCollection = applicants));

    this.creditFacilityLoanLimitService
      .query()
      .pipe(map((res: HttpResponse<ICreditFacilityLoanLimit[]>) => res.body ?? []))
      .pipe(
        map((creditFacilityLoanLimits: ICreditFacilityLoanLimit[]) =>
          this.creditFacilityLoanLimitService.addCreditFacilityLoanLimitToCollectionIfMissing(
            creditFacilityLoanLimits,
            this.editForm.get('creditFacilityLoanLimit')!.value
          )
        )
      )
      .subscribe(
        (creditFacilityLoanLimits: ICreditFacilityLoanLimit[]) => (this.creditFacilityLoanLimitsSharedCollection = creditFacilityLoanLimits)
      );

    this.currencyService
      .query()
      .pipe(map((res: HttpResponse<ICurrency[]>) => res.body ?? []))
      .pipe(
        map((currencies: ICurrency[]) =>
          this.currencyService.addCurrencyToCollectionIfMissing(currencies, this.editForm.get('currency')!.value)
        )
      )
      .subscribe((currencies: ICurrency[]) => (this.currenciesSharedCollection = currencies));
  }

  protected createFromForm(): ICreditFacility {
    return {
      ...new CreditFacility(),
      id: this.editForm.get(['id'])!.value,
      totalLimit: this.editForm.get(['totalLimit'])!.value,
      availableLimit: this.editForm.get(['availableLimit'])!.value,
      startDate: this.editForm.get(['startDate'])!.value,
      endDate: this.editForm.get(['endDate'])!.value,
      status: this.editForm.get(['status'])!.value,
      editedBy: this.editForm.get(['editedBy'])!.value,
      editedOn: this.editForm.get(['editedOn'])!.value,
      createdBy: this.editForm.get(['createdBy'])!.value,
      createdOn: this.editForm.get(['createdOn'])!.value,
      applicant: this.editForm.get(['applicant'])!.value,
      creditFacilityLoanLimit: this.editForm.get(['creditFacilityLoanLimit'])!.value,
      currency: this.editForm.get(['currency'])!.value,
    };
  }
}

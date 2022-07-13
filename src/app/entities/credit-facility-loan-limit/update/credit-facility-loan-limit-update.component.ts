import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICreditFacilityLoanLimit, CreditFacilityLoanLimit } from '../credit-facility-loan-limit.model';
import { CreditFacilityLoanLimitService } from '../service/credit-facility-loan-limit.service';
import { ILoanType } from 'src/app/entities/loan-type/loan-type.model';
import { LoanTypeService } from 'src/app/entities/loan-type/service/loan-type.service';
import { Status } from 'src/app/entities/enumerations/status.model';

@Component({
  selector: 'app-credit-facility-loan-limit-update',
  templateUrl: './credit-facility-loan-limit-update.component.html',
})
export class CreditFacilityLoanLimitUpdateComponent implements OnInit {
  isSaving = false;
  statusValues = Object.keys(Status);

  loanTypesSharedCollection: ILoanType[] = [];

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    totalLimit: [null, [Validators.required]],
    status: [null, [Validators.required]],
    editedBy: [],
    editedOn: [],
    createdBy: [],
    createdOn: [],
    loanType: [],
  });

  constructor(
    protected creditFacilityLoanLimitService: CreditFacilityLoanLimitService,
    protected loanTypeService: LoanTypeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ creditFacilityLoanLimit }) => {
      this.updateForm(creditFacilityLoanLimit);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const creditFacilityLoanLimit = this.createFromForm();
    if (creditFacilityLoanLimit.id !== undefined) {
      this.subscribeToSaveResponse(this.creditFacilityLoanLimitService.update(creditFacilityLoanLimit));
    } else {
      this.subscribeToSaveResponse(this.creditFacilityLoanLimitService.create(creditFacilityLoanLimit));
    }
  }

  trackLoanTypeById(_index: number, item: ILoanType): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICreditFacilityLoanLimit>>): void {
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

  protected updateForm(creditFacilityLoanLimit: ICreditFacilityLoanLimit): void {
    this.editForm.patchValue({
      id: creditFacilityLoanLimit.id,
      code: creditFacilityLoanLimit.code,
      totalLimit: creditFacilityLoanLimit.totalLimit,
      status: creditFacilityLoanLimit.status,
      editedBy: creditFacilityLoanLimit.editedBy,
      editedOn: creditFacilityLoanLimit.editedOn,
      createdBy: creditFacilityLoanLimit.createdBy,
      createdOn: creditFacilityLoanLimit.createdOn,
      loanType: creditFacilityLoanLimit.loanType,
    });

    this.loanTypesSharedCollection = this.loanTypeService.addLoanTypeToCollectionIfMissing(
      this.loanTypesSharedCollection,
      creditFacilityLoanLimit.loanType
    );
  }

  protected loadRelationshipsOptions(): void {
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

  protected createFromForm(): ICreditFacilityLoanLimit {
    return {
      ...new CreditFacilityLoanLimit(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      totalLimit: this.editForm.get(['totalLimit'])!.value,
      status: this.editForm.get(['status'])!.value,
      editedBy: this.editForm.get(['editedBy'])!.value,
      editedOn: this.editForm.get(['editedOn'])!.value,
      createdBy: this.editForm.get(['createdBy'])!.value,
      createdOn: this.editForm.get(['createdOn'])!.value,
      loanType: this.editForm.get(['loanType'])!.value,
    };
  }
}

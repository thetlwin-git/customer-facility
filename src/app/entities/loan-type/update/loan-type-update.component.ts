import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ILoanType, LoanType } from '../loan-type.model';
import { LoanTypeService } from '../service/loan-type.service';
import { Status } from 'src/app/entities/enumerations/status.model';

@Component({
  selector: 'app-loan-type-update',
  templateUrl: './loan-type-update.component.html',
})
export class LoanTypeUpdateComponent implements OnInit {
  isSaving = false;
  statusValues = Object.keys(Status);

  editForm = this.fb.group({
    id: [],
    code: [],
    label: [],
    status: [null, [Validators.required]],
    editedBy: [],
    editedOn: [],
    createdBy: [],
    createdOn: [],
  });

  constructor(protected loanTypeService: LoanTypeService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loanType }) => {
      this.updateForm(loanType);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const loanType = this.createFromForm();
    if (loanType.id !== undefined) {
      this.subscribeToSaveResponse(this.loanTypeService.update(loanType));
    } else {
      this.subscribeToSaveResponse(this.loanTypeService.create(loanType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILoanType>>): void {
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

  protected updateForm(loanType: ILoanType): void {
    this.editForm.patchValue({
      id: loanType.id,
      code: loanType.code,
      label: loanType.label,
      status: loanType.status,
      editedBy: loanType.editedBy,
      editedOn: loanType.editedOn,
      createdBy: loanType.createdBy,
      createdOn: loanType.createdOn,
    });
  }

  protected createFromForm(): ILoanType {
    return {
      ...new LoanType(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      label: this.editForm.get(['label'])!.value,
      status: this.editForm.get(['status'])!.value,
      editedBy: this.editForm.get(['editedBy'])!.value,
      editedOn: this.editForm.get(['editedOn'])!.value,
      createdBy: this.editForm.get(['createdBy'])!.value,
      createdOn: this.editForm.get(['createdOn'])!.value,
    };
  }
}

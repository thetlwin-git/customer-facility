import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ILoanPayment, LoanPayment } from '../loan-payment.model';
import { LoanPaymentService } from '../service/loan-payment.service';
import { Status } from 'src/app/entities/enumerations/status.model';

@Component({
  selector: 'app-loan-payment-update',
  templateUrl: './loan-payment-update.component.html',
})
export class LoanPaymentUpdateComponent implements OnInit {
  isSaving = false;
  statusValues = Object.keys(Status);

  editForm = this.fb.group({
    id: [],
    amount: [null, [Validators.required]],
    paymentDate: [],
    status: [null, [Validators.required]],
    editedBy: [],
    editedOn: [],
    createdBy: [],
    createdOn: [],
  });

  constructor(protected loanPaymentService: LoanPaymentService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loanPayment }) => {
      this.updateForm(loanPayment);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const loanPayment = this.createFromForm();
    if (loanPayment.id !== undefined) {
      this.subscribeToSaveResponse(this.loanPaymentService.update(loanPayment));
    } else {
      this.subscribeToSaveResponse(this.loanPaymentService.create(loanPayment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILoanPayment>>): void {
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

  protected updateForm(loanPayment: ILoanPayment): void {
    this.editForm.patchValue({
      id: loanPayment.id,
      amount: loanPayment.amount,
      paymentDate: loanPayment.paymentDate,
      status: loanPayment.status,
      editedBy: loanPayment.editedBy,
      editedOn: loanPayment.editedOn,
      createdBy: loanPayment.createdBy,
      createdOn: loanPayment.createdOn,
    });
  }

  protected createFromForm(): ILoanPayment {
    return {
      ...new LoanPayment(),
      id: this.editForm.get(['id'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      paymentDate: this.editForm.get(['paymentDate'])!.value,
      status: this.editForm.get(['status'])!.value,
      editedBy: this.editForm.get(['editedBy'])!.value,
      editedOn: this.editForm.get(['editedOn'])!.value,
      createdBy: this.editForm.get(['createdBy'])!.value,
      createdOn: this.editForm.get(['createdOn'])!.value,
    };
  }
}

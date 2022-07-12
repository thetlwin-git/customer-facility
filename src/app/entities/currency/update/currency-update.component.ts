import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICurrency, Currency } from '../currency.model';
import { CurrencyService } from '../service/currency.service';
import { Status } from 'src/app/entities/enumerations/status.model';

@Component({
  selector: 'jhi-currency-update',
  templateUrl: './currency-update.component.html',
})
export class CurrencyUpdateComponent implements OnInit {
  isSaving = false;
  statusValues = Object.keys(Status);

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    label: [null, [Validators.required]],
    status: [null, [Validators.required]],
    editedBy: [],
    editedOn: [],
    createdBy: [],
    createdOn: [],
  });

  constructor(protected currencyService: CurrencyService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ currency }) => {
      this.updateForm(currency);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const currency = this.createFromForm();
    if (currency.id !== undefined) {
      this.subscribeToSaveResponse(this.currencyService.update(currency));
    } else {
      this.subscribeToSaveResponse(this.currencyService.create(currency));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICurrency>>): void {
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

  protected updateForm(currency: ICurrency): void {
    this.editForm.patchValue({
      id: currency.id,
      code: currency.code,
      label: currency.label,
      status: currency.status,
      editedBy: currency.editedBy,
      editedOn: currency.editedOn,
      createdBy: currency.createdBy,
      createdOn: currency.createdOn,
    });
  }

  protected createFromForm(): ICurrency {
    return {
      ...new Currency(),
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

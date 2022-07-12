import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILoanType } from '../loan-type.model';
import { LoanTypeService } from '../service/loan-type.service';
import { LoanTypeDeleteDialogComponent } from '../delete/loan-type-delete-dialog.component';

@Component({
  selector: 'jhi-loan-type',
  templateUrl: './loan-type.component.html',
})
export class LoanTypeComponent implements OnInit {
  loanTypes?: ILoanType[];
  isLoading = false;

  constructor(protected loanTypeService: LoanTypeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.loanTypeService.query().subscribe({
      next: (res: HttpResponse<ILoanType[]>) => {
        this.isLoading = false;
        this.loanTypes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ILoanType): number {
    return item.id!;
  }

  delete(loanType: ILoanType): void {
    const modalRef = this.modalService.open(LoanTypeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.loanType = loanType;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

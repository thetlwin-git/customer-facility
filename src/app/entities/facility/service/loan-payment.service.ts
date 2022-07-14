import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'src/app/core/util/operators';
import { DATE_FORMAT } from 'src/app/config/input.constants';
import { ApplicationConfigService } from 'src/app/core/config/application-config.service';
import { createRequestOption } from 'src/app/core/request/request-util';
import { ILoanPayment, getLoanPaymentIdentifier } from '../model/loan-payment.model';

export type EntityResponseType = HttpResponse<ILoanPayment>;
export type EntityArrayResponseType = HttpResponse<ILoanPayment[]>;

@Injectable({ providedIn: 'root' })
export class LoanPaymentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/loan-payments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(loanPayment: ILoanPayment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(loanPayment);
    return this.http
      .post<ILoanPayment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(loanPayment: ILoanPayment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(loanPayment);
    return this.http
      .put<ILoanPayment>(`${this.resourceUrl}/${getLoanPaymentIdentifier(loanPayment) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(loanPayment: ILoanPayment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(loanPayment);
    return this.http
      .patch<ILoanPayment>(`${this.resourceUrl}/${getLoanPaymentIdentifier(loanPayment) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ILoanPayment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ILoanPayment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLoanPaymentToCollectionIfMissing(
    loanPaymentCollection: ILoanPayment[],
    ...loanPaymentsToCheck: (ILoanPayment | null | undefined)[]
  ): ILoanPayment[] {
    const loanPayments: ILoanPayment[] = loanPaymentsToCheck.filter(isPresent);
    if (loanPayments.length > 0) {
      const loanPaymentCollectionIdentifiers = loanPaymentCollection.map(loanPaymentItem => getLoanPaymentIdentifier(loanPaymentItem)!);
      const loanPaymentsToAdd = loanPayments.filter(loanPaymentItem => {
        const loanPaymentIdentifier = getLoanPaymentIdentifier(loanPaymentItem);
        if (loanPaymentIdentifier == null || loanPaymentCollectionIdentifiers.includes(loanPaymentIdentifier)) {
          return false;
        }
        loanPaymentCollectionIdentifiers.push(loanPaymentIdentifier);
        return true;
      });
      return [...loanPaymentsToAdd, ...loanPaymentCollection];
    }
    return loanPaymentCollection;
  }

  protected convertDateFromClient(loanPayment: ILoanPayment): ILoanPayment {
    return Object.assign({}, loanPayment, {
      paymentDate: loanPayment.paymentDate?.isValid() ? loanPayment.paymentDate.format(DATE_FORMAT) : undefined,
      editedOn: loanPayment.editedOn?.isValid() ? loanPayment.editedOn.format(DATE_FORMAT) : undefined,
      createdOn: loanPayment.createdOn?.isValid() ? loanPayment.createdOn.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.paymentDate = res.body.paymentDate ? dayjs(res.body.paymentDate) : undefined;
      res.body.editedOn = res.body.editedOn ? dayjs(res.body.editedOn) : undefined;
      res.body.createdOn = res.body.createdOn ? dayjs(res.body.createdOn) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((loanPayment: ILoanPayment) => {
        loanPayment.paymentDate = loanPayment.paymentDate ? dayjs(loanPayment.paymentDate) : undefined;
        loanPayment.editedOn = loanPayment.editedOn ? dayjs(loanPayment.editedOn) : undefined;
        loanPayment.createdOn = loanPayment.createdOn ? dayjs(loanPayment.createdOn) : undefined;
      });
    }
    return res;
  }
}

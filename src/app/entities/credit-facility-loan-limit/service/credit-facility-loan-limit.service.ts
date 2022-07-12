import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'src/app/core/util/operators';
import { DATE_FORMAT } from 'src/app/config/input.constants';
import { ApplicationConfigService } from 'src/app/core/config/application-config.service';
import { createRequestOption } from 'src/app/core/request/request-util';
import { ICreditFacilityLoanLimit, getCreditFacilityLoanLimitIdentifier } from '../credit-facility-loan-limit.model';

export type EntityResponseType = HttpResponse<ICreditFacilityLoanLimit>;
export type EntityArrayResponseType = HttpResponse<ICreditFacilityLoanLimit[]>;

@Injectable({ providedIn: 'root' })
export class CreditFacilityLoanLimitService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/credit-facility-loan-limits');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(creditFacilityLoanLimit: ICreditFacilityLoanLimit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(creditFacilityLoanLimit);
    return this.http
      .post<ICreditFacilityLoanLimit>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(creditFacilityLoanLimit: ICreditFacilityLoanLimit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(creditFacilityLoanLimit);
    return this.http
      .put<ICreditFacilityLoanLimit>(
        `${this.resourceUrl}/${getCreditFacilityLoanLimitIdentifier(creditFacilityLoanLimit) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(creditFacilityLoanLimit: ICreditFacilityLoanLimit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(creditFacilityLoanLimit);
    return this.http
      .patch<ICreditFacilityLoanLimit>(
        `${this.resourceUrl}/${getCreditFacilityLoanLimitIdentifier(creditFacilityLoanLimit) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICreditFacilityLoanLimit>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICreditFacilityLoanLimit[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCreditFacilityLoanLimitToCollectionIfMissing(
    creditFacilityLoanLimitCollection: ICreditFacilityLoanLimit[],
    ...creditFacilityLoanLimitsToCheck: (ICreditFacilityLoanLimit | null | undefined)[]
  ): ICreditFacilityLoanLimit[] {
    const creditFacilityLoanLimits: ICreditFacilityLoanLimit[] = creditFacilityLoanLimitsToCheck.filter(isPresent);
    if (creditFacilityLoanLimits.length > 0) {
      const creditFacilityLoanLimitCollectionIdentifiers = creditFacilityLoanLimitCollection.map(
        creditFacilityLoanLimitItem => getCreditFacilityLoanLimitIdentifier(creditFacilityLoanLimitItem)!
      );
      const creditFacilityLoanLimitsToAdd = creditFacilityLoanLimits.filter(creditFacilityLoanLimitItem => {
        const creditFacilityLoanLimitIdentifier = getCreditFacilityLoanLimitIdentifier(creditFacilityLoanLimitItem);
        if (
          creditFacilityLoanLimitIdentifier == null ||
          creditFacilityLoanLimitCollectionIdentifiers.includes(creditFacilityLoanLimitIdentifier)
        ) {
          return false;
        }
        creditFacilityLoanLimitCollectionIdentifiers.push(creditFacilityLoanLimitIdentifier);
        return true;
      });
      return [...creditFacilityLoanLimitsToAdd, ...creditFacilityLoanLimitCollection];
    }
    return creditFacilityLoanLimitCollection;
  }

  protected convertDateFromClient(creditFacilityLoanLimit: ICreditFacilityLoanLimit): ICreditFacilityLoanLimit {
    return Object.assign({}, creditFacilityLoanLimit, {
      editedOn: creditFacilityLoanLimit.editedOn?.isValid() ? creditFacilityLoanLimit.editedOn.format(DATE_FORMAT) : undefined,
      createdOn: creditFacilityLoanLimit.createdOn?.isValid() ? creditFacilityLoanLimit.createdOn.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.editedOn = res.body.editedOn ? dayjs(res.body.editedOn) : undefined;
      res.body.createdOn = res.body.createdOn ? dayjs(res.body.createdOn) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((creditFacilityLoanLimit: ICreditFacilityLoanLimit) => {
        creditFacilityLoanLimit.editedOn = creditFacilityLoanLimit.editedOn ? dayjs(creditFacilityLoanLimit.editedOn) : undefined;
        creditFacilityLoanLimit.createdOn = creditFacilityLoanLimit.createdOn ? dayjs(creditFacilityLoanLimit.createdOn) : undefined;
      });
    }
    return res;
  }
}

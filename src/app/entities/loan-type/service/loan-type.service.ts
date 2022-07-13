import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'src/app/core/util/operators';
import { DATE_FORMAT } from 'src/app/config/input.constants';
import { ApplicationConfigService } from 'src/app/core/config/application-config.service';
import { createRequestOption } from 'src/app/core/request/request-util';
import { ILoanType, getLoanTypeIdentifier } from '../loan-type.model';

export type EntityResponseType = HttpResponse<ILoanType>;
export type EntityArrayResponseType = HttpResponse<ILoanType[]>;

@Injectable({ providedIn: 'root' })
export class LoanTypeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/loan-types');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(loanType: ILoanType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(loanType);
    return this.http
      .post<ILoanType>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(loanType: ILoanType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(loanType);
    return this.http
      .put<ILoanType>(`${this.resourceUrl}/${getLoanTypeIdentifier(loanType) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(loanType: ILoanType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(loanType);
    return this.http
      .patch<ILoanType>(`${this.resourceUrl}/${getLoanTypeIdentifier(loanType) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ILoanType>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ILoanType[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLoanTypeToCollectionIfMissing(loanTypeCollection: ILoanType[], ...loanTypesToCheck: (ILoanType | null | undefined)[]): ILoanType[] {
    const loanTypes: ILoanType[] = loanTypesToCheck.filter(isPresent);
    if (loanTypes.length > 0) {
      const loanTypeCollectionIdentifiers = loanTypeCollection.map(loanTypeItem => getLoanTypeIdentifier(loanTypeItem)!);
      const loanTypesToAdd = loanTypes.filter(loanTypeItem => {
        const loanTypeIdentifier = getLoanTypeIdentifier(loanTypeItem);
        if (loanTypeIdentifier == null || loanTypeCollectionIdentifiers.includes(loanTypeIdentifier)) {
          return false;
        }
        loanTypeCollectionIdentifiers.push(loanTypeIdentifier);
        return true;
      });
      return [...loanTypesToAdd, ...loanTypeCollection];
    }
    return loanTypeCollection;
  }

  protected convertDateFromClient(loanType: ILoanType): ILoanType {
    return Object.assign({}, loanType, {
      editedOn: loanType.editedOn?.isValid() ? loanType.editedOn.format(DATE_FORMAT) : undefined,
      createdOn: loanType.createdOn?.isValid() ? loanType.createdOn.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((loanType: ILoanType) => {
        loanType.editedOn = loanType.editedOn ? dayjs(loanType.editedOn) : undefined;
        loanType.createdOn = loanType.createdOn ? dayjs(loanType.createdOn) : undefined;
      });
    }
    return res;
  }
}

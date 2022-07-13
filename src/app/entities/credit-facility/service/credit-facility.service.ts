import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'src/app/core/util/operators';
import { DATE_FORMAT } from 'src/app/config/input.constants';
import { ApplicationConfigService } from 'src/app/core/config/application-config.service';
import { createRequestOption } from 'src/app/core/request/request-util';
import { ICreditFacility, getCreditFacilityIdentifier } from '../credit-facility.model';

export type EntityResponseType = HttpResponse<ICreditFacility>;
export type EntityArrayResponseType = HttpResponse<ICreditFacility[]>;

@Injectable({ providedIn: 'root' })
export class CreditFacilityService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/credit-facilities');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(creditFacility: ICreditFacility): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(creditFacility);
    return this.http
      .post<ICreditFacility>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(creditFacility: ICreditFacility): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(creditFacility);
    return this.http
      .put<ICreditFacility>(`${this.resourceUrl}/${getCreditFacilityIdentifier(creditFacility) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(creditFacility: ICreditFacility): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(creditFacility);
    return this.http
      .patch<ICreditFacility>(`${this.resourceUrl}/${getCreditFacilityIdentifier(creditFacility) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICreditFacility>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICreditFacility[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCreditFacilityToCollectionIfMissing(
    creditFacilityCollection: ICreditFacility[],
    ...creditFacilitiesToCheck: (ICreditFacility | null | undefined)[]
  ): ICreditFacility[] {
    const creditFacilities: ICreditFacility[] = creditFacilitiesToCheck.filter(isPresent);
    if (creditFacilities.length > 0) {
      const creditFacilityCollectionIdentifiers = creditFacilityCollection.map(
        creditFacilityItem => getCreditFacilityIdentifier(creditFacilityItem)!
      );
      const creditFacilitiesToAdd = creditFacilities.filter(creditFacilityItem => {
        const creditFacilityIdentifier = getCreditFacilityIdentifier(creditFacilityItem);
        if (creditFacilityIdentifier == null || creditFacilityCollectionIdentifiers.includes(creditFacilityIdentifier)) {
          return false;
        }
        creditFacilityCollectionIdentifiers.push(creditFacilityIdentifier);
        return true;
      });
      return [...creditFacilitiesToAdd, ...creditFacilityCollection];
    }
    return creditFacilityCollection;
  }

  protected convertDateFromClient(creditFacility: ICreditFacility): ICreditFacility {
    return Object.assign({}, creditFacility, {
      startDate: creditFacility.startDate?.isValid() ? creditFacility.startDate.format(DATE_FORMAT) : undefined,
      endDate: creditFacility.endDate?.isValid() ? creditFacility.endDate.format(DATE_FORMAT) : undefined,
      editedOn: creditFacility.editedOn?.isValid() ? creditFacility.editedOn.format(DATE_FORMAT) : undefined,
      createdOn: creditFacility.createdOn?.isValid() ? creditFacility.createdOn.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startDate = res.body.startDate ? dayjs(res.body.startDate) : undefined;
      res.body.endDate = res.body.endDate ? dayjs(res.body.endDate) : undefined;
      res.body.editedOn = res.body.editedOn ? dayjs(res.body.editedOn) : undefined;
      res.body.createdOn = res.body.createdOn ? dayjs(res.body.createdOn) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((creditFacility: ICreditFacility) => {
        creditFacility.startDate = creditFacility.startDate ? dayjs(creditFacility.startDate) : undefined;
        creditFacility.endDate = creditFacility.endDate ? dayjs(creditFacility.endDate) : undefined;
        creditFacility.editedOn = creditFacility.editedOn ? dayjs(creditFacility.editedOn) : undefined;
        creditFacility.createdOn = creditFacility.createdOn ? dayjs(creditFacility.createdOn) : undefined;
      });
    }
    return res;
  }
}

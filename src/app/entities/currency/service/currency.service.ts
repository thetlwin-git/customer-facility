import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'src/app/core/util/operators';
import { DATE_FORMAT } from 'src/app/config/input.constants';
import { ApplicationConfigService } from 'src/app/core/config/application-config.service';
import { createRequestOption } from 'src/app/core/request/request-util';
import { ICurrency, getCurrencyIdentifier } from '../currency.model';

export type EntityResponseType = HttpResponse<ICurrency>;
export type EntityArrayResponseType = HttpResponse<ICurrency[]>;

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/currencies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(currency: ICurrency): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(currency);
    return this.http
      .post<ICurrency>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(currency: ICurrency): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(currency);
    return this.http
      .put<ICurrency>(`${this.resourceUrl}/${getCurrencyIdentifier(currency) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(currency: ICurrency): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(currency);
    return this.http
      .patch<ICurrency>(`${this.resourceUrl}/${getCurrencyIdentifier(currency) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICurrency>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICurrency[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCurrencyToCollectionIfMissing(currencyCollection: ICurrency[], ...currenciesToCheck: (ICurrency | null | undefined)[]): ICurrency[] {
    const currencies: ICurrency[] = currenciesToCheck.filter(isPresent);
    if (currencies.length > 0) {
      const currencyCollectionIdentifiers = currencyCollection.map(currencyItem => getCurrencyIdentifier(currencyItem)!);
      const currenciesToAdd = currencies.filter(currencyItem => {
        const currencyIdentifier = getCurrencyIdentifier(currencyItem);
        if (currencyIdentifier == null || currencyCollectionIdentifiers.includes(currencyIdentifier)) {
          return false;
        }
        currencyCollectionIdentifiers.push(currencyIdentifier);
        return true;
      });
      return [...currenciesToAdd, ...currencyCollection];
    }
    return currencyCollection;
  }

  protected convertDateFromClient(currency: ICurrency): ICurrency {
    return Object.assign({}, currency, {
      editedOn: currency.editedOn?.isValid() ? currency.editedOn.format(DATE_FORMAT) : undefined,
      createdOn: currency.createdOn?.isValid() ? currency.createdOn.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((currency: ICurrency) => {
        currency.editedOn = currency.editedOn ? dayjs(currency.editedOn) : undefined;
        currency.createdOn = currency.createdOn ? dayjs(currency.createdOn) : undefined;
      });
    }
    return res;
  }
}

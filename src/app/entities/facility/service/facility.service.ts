import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'src/app/core/util/operators';
import { DATE_FORMAT } from 'src/app/config/input.constants';
import { ApplicationConfigService } from 'src/app/core/config/application-config.service';
import { createRequestOption } from 'src/app/core/request/request-util';
import { ILoan, getLoanIdentifier } from '../model/loan.model';

export type EntityResponseType = HttpResponse<ILoan>;
export type EntityArrayResponseType = HttpResponse<ILoan[]>;

@Injectable({ providedIn: 'root' })
export class FacilityService {
    //   protected resourceUrl = this.applicationConfigService.getEndpointFor('api/loans');
    protected facilityUrl = this.applicationConfigService.getEndpointFor('api/facility/loans');

    constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) { }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ILoan[]>(this.facilityUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    addLoanToCollectionIfMissing(loanCollection: ILoan[], ...loansToCheck: (ILoan | null | undefined)[]): ILoan[] {
        const loans: ILoan[] = loansToCheck.filter(isPresent);
        if (loans.length > 0) {
            const loanCollectionIdentifiers = loanCollection.map(loanItem => getLoanIdentifier(loanItem)!);
            const loansToAdd = loans.filter(loanItem => {
                const loanIdentifier = getLoanIdentifier(loanItem);
                if (loanIdentifier == null || loanCollectionIdentifiers.includes(loanIdentifier)) {
                    return false;
                }
                loanCollectionIdentifiers.push(loanIdentifier);
                return true;
            });
            return [...loansToAdd, ...loanCollection];
        }
        return loanCollection;
    }

    protected convertDateFromClient(loan: ILoan): ILoan {
        return Object.assign({}, loan, {
            startDate: loan.startDate?.isValid() ? loan.startDate.format(DATE_FORMAT) : undefined,
            endDate: loan.endDate?.isValid() ? loan.endDate.format(DATE_FORMAT) : undefined,
            editedOn: loan.editedOn?.isValid() ? loan.editedOn.format(DATE_FORMAT) : undefined,
            createdOn: loan.createdOn?.isValid() ? loan.createdOn.format(DATE_FORMAT) : undefined,
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
            res.body.forEach((loan: ILoan) => {
                loan.startDate = loan.startDate ? dayjs(loan.startDate) : undefined;
                loan.endDate = loan.endDate ? dayjs(loan.endDate) : undefined;
                loan.editedOn = loan.editedOn ? dayjs(loan.editedOn) : undefined;
                loan.createdOn = loan.createdOn ? dayjs(loan.createdOn) : undefined;

                const facility = loan.facility;
                if (facility) {
                    facility.startDate = facility.startDate ? dayjs(facility.startDate) : undefined;
                    facility.endDate = facility.endDate ? dayjs(facility.endDate) : undefined;
                }
            });
        }
        return res;
    }
}

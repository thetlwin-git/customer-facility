import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'src/app/core/util/operators';
import { DATE_FORMAT } from 'src/app/config/input.constants';
import { ApplicationConfigService } from 'src/app/core/config/application-config.service';
import { createRequestOption } from 'src/app/core/request/request-util';
import { IApplicant, getApplicantIdentifier } from '../applicant.model';

export type EntityResponseType = HttpResponse<IApplicant>;
export type EntityArrayResponseType = HttpResponse<IApplicant[]>;

@Injectable({ providedIn: 'root' })
export class ApplicantService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/applicants');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(applicant: IApplicant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(applicant);
    return this.http
      .post<IApplicant>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(applicant: IApplicant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(applicant);
    return this.http
      .put<IApplicant>(`${this.resourceUrl}/${getApplicantIdentifier(applicant) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(applicant: IApplicant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(applicant);
    return this.http
      .patch<IApplicant>(`${this.resourceUrl}/${getApplicantIdentifier(applicant) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IApplicant>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IApplicant[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addApplicantToCollectionIfMissing(
    applicantCollection: IApplicant[],
    ...applicantsToCheck: (IApplicant | null | undefined)[]
  ): IApplicant[] {
    const applicants: IApplicant[] = applicantsToCheck.filter(isPresent);
    if (applicants.length > 0) {
      const applicantCollectionIdentifiers = applicantCollection.map(applicantItem => getApplicantIdentifier(applicantItem)!);
      const applicantsToAdd = applicants.filter(applicantItem => {
        const applicantIdentifier = getApplicantIdentifier(applicantItem);
        if (applicantIdentifier == null || applicantCollectionIdentifiers.includes(applicantIdentifier)) {
          return false;
        }
        applicantCollectionIdentifiers.push(applicantIdentifier);
        return true;
      });
      return [...applicantsToAdd, ...applicantCollection];
    }
    return applicantCollection;
  }

  protected convertDateFromClient(applicant: IApplicant): IApplicant {
    return Object.assign({}, applicant, {
      editedOn: applicant.editedOn?.isValid() ? applicant.editedOn.format(DATE_FORMAT) : undefined,
      createdOn: applicant.createdOn?.isValid() ? applicant.createdOn.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((applicant: IApplicant) => {
        applicant.editedOn = applicant.editedOn ? dayjs(applicant.editedOn) : undefined;
        applicant.createdOn = applicant.createdOn ? dayjs(applicant.createdOn) : undefined;
      });
    }
    return res;
  }
}

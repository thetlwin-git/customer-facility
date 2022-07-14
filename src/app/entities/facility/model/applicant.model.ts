import dayjs from 'dayjs/esm';
import { IUser } from '../model/user.model';
import { IStatus } from '../model/status.model';
import { ICreditFacility } from '../model/credit-facility.model';

export interface IApplicant {
  id?: number;
  fullName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  editedBy?: string | null;
  editedOn?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdOn?: dayjs.Dayjs | null;
  user?: IUser | null;
  status?: IStatus | null;
  creditFacility?: ICreditFacility | null;
}

export class Applicant implements IApplicant {
  constructor(
    public id?: number,
    public fullName?: string | null,
    public email?: string | null,
    public phoneNumber?: string | null,
    public address?: string | null,
    public editedBy?: string | null,
    public editedOn?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public createdOn?: dayjs.Dayjs | null,
    public user?: IUser | null,
    public status?: IStatus | null,
    public creditFacility?: ICreditFacility | null
  ) {}
}

export function getApplicantIdentifier(applicant: IApplicant): number | undefined {
  return applicant.id;
}

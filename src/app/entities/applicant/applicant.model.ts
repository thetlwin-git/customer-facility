import dayjs from 'dayjs/esm';
import { IUser } from 'src/app/entities/user/user.model';
import { ICreditFacility } from 'src/app/entities/credit-facility/credit-facility.model';
import { Status } from 'src/app/entities/enumerations/status.model';

export interface IApplicant {
  id?: number;
  fullName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  status?: Status;
  editedBy?: string | null;
  editedOn?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdOn?: dayjs.Dayjs | null;
  user?: IUser | null;
  creditFacility?: ICreditFacility | null;
}

export class Applicant implements IApplicant {
  constructor(
    public id?: number,
    public fullName?: string | null,
    public email?: string | null,
    public phoneNumber?: string | null,
    public address?: string | null,
    public status?: Status,
    public editedBy?: string | null,
    public editedOn?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public createdOn?: dayjs.Dayjs | null,
    public user?: IUser | null,
    public creditFacility?: ICreditFacility | null
  ) {}
}

export function getApplicantIdentifier(applicant: IApplicant): number | undefined {
  return applicant.id;
}

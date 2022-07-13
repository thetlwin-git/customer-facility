import dayjs from 'dayjs/esm';
import { IApplicant } from 'src/app/entities/applicant/applicant.model';
import { ICurrency } from 'src/app/entities/currency/currency.model';
import { ICreditFacilityLoanLimit } from 'src/app/entities/credit-facility-loan-limit/credit-facility-loan-limit.model';
import { Status } from 'src/app/entities/enumerations/status.model';

export interface ICreditFacility {
  id?: number;
  code?: string;
  totalLimit?: number;
  availableLimit?: number;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs | null;
  status?: Status;
  editedBy?: string | null;
  editedOn?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdOn?: dayjs.Dayjs | null;
  applicant?: IApplicant | null;
  currency?: ICurrency | null;
  loanLimits?: ICreditFacilityLoanLimit[] | null;
}

export class CreditFacility implements ICreditFacility {
  constructor(
    public id?: number,
    public code?: string,
    public totalLimit?: number,
    public availableLimit?: number,
    public startDate?: dayjs.Dayjs,
    public endDate?: dayjs.Dayjs | null,
    public status?: Status,
    public editedBy?: string | null,
    public editedOn?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public createdOn?: dayjs.Dayjs | null,
    public applicant?: IApplicant | null,
    public currency?: ICurrency | null,
    public loanLimits?: ICreditFacilityLoanLimit[] | null
  ) {}
}

export function getCreditFacilityIdentifier(creditFacility: ICreditFacility): number | undefined {
  return creditFacility.id;
}

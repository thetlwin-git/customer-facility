import dayjs from 'dayjs/esm';
import { Status } from 'src/app/entities/enumerations/status.model';

export interface ICurrency {
  id?: number;
  code?: string;
  label?: string;
  status?: Status;
  editedBy?: string | null;
  editedOn?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdOn?: dayjs.Dayjs | null;
}

export class Currency implements ICurrency {
  constructor(
    public id?: number,
    public code?: string,
    public label?: string,
    public status?: Status,
    public editedBy?: string | null,
    public editedOn?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public createdOn?: dayjs.Dayjs | null
  ) {}
}

export function getCurrencyIdentifier(currency: ICurrency): number | undefined {
  return currency.id;
}

export interface ServerResponse<T> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

export interface DataServiceRequestOptions {
  limit: number;
  skip: number;
  sortOrder?: string;
  sortBy?: string;
  [prop: string]: any;
}

export interface DataServiceResponse<T> {
  content: T;
  total: number;
}

export enum Theme {
  Default = 'default',
  Light = 'light',
  Test = 'test',
}

export interface PageRequestOptions {
  pageSize: number;
  pageNum: number;
  orderBy?: string;
  orderDirection?: string;
  filter?: string;
  status?: string | string[];
  startDate?: string;
  endDate?: string;
  [property: string]: any;
}

export interface PageResponse<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pagable;
  size: number;
  sort: Record<string, any>;
  totalElements: number;
  totalPages: number;
}

export interface Pagable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: Record<string, any>;
  unpaged: boolean;
}

export interface AccountOrganization {
  id: string;
  organizationName: string;
  organizationFactAddress: string;
  organizationLegalAddress: string;
  organizationPhones: string;
  organizationEmail: string;
  organizationWebsite: string;
  organizationDirector: string;
  organizationInn: string;
  organizationOgrn: string;
  bankName: string;
  bankAccount: string;
  bankCorrAccount: string;
  bankBic: string;
  fio: string;
  phone: string;
  email: string;
  position: string;
}

export interface EPCSUser {
  id: string;
  contactPersonId: string;
  organizationId: string;
  fio: string;
  lastName: string;
  firstName: string;
  middleName: string;
  phone: string;
  fax: string;
  email: string;
  position: string;
  registerUserType: number;
  isAdmin: boolean;
}

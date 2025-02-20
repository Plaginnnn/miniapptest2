export enum TransmissionType {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
  ROBOT = 'ROBOT',
  CVT = 'CVT',
  NONE = 'NONE'
}

export const TransmissionTypeLabels: Record<TransmissionType, string> = {
  [TransmissionType.MANUAL]: 'Механика',
  [TransmissionType.AUTOMATIC]: 'Автомат',
  [TransmissionType.ROBOT]: 'Робот',
  [TransmissionType.CVT]: 'Вариатор',
  [TransmissionType.NONE]: 'Не указано'
};

export enum RestrictionType {
  BAILIFF = 'BAILIFF',
  PLEDGE = 'PLEDGE',
  TRIBUNAL = 'TRIBUNAL',
  NONE = 'NONE'
}

export const RestrictionTypeLabels: Record<RestrictionType, string> = {
  [RestrictionType.BAILIFF]: 'Пристав',
  [RestrictionType.PLEDGE]: 'Залог',
  [RestrictionType.TRIBUNAL]: 'Судебка',
  [RestrictionType.NONE]: 'Не указано'
};

export interface Car {
  id: string;
  brand: string;
  model: string;
  registrationNumber: string;
  vinNumber: string;
  transmissionType: TransmissionType;
  restrictionType: RestrictionType;
  currentPrice: number;
  year: number;
  photos: string[];
  enginePower: number;
  engineVolume: number;
  ownerCount: number;
  retailPrice: number;
  minimalPrice: number;
  bitDate: string;
  additionalInfo: string[];
  problemInfo: string[];
}

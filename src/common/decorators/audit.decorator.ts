import { SetMetadata } from '@nestjs/common';

export const AUDIT_KEY = 'audit';
export const Audit = (actionType: string) => SetMetadata(AUDIT_KEY, actionType);

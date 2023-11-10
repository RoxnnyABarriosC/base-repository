import { SetMetadata } from '@nestjs/common';

export const APPLY_VALIDATION_BODY_KEY = 'apply_validation_body_key';
export const ApplyValidationBody = (dto: any) => SetMetadata(APPLY_VALIDATION_BODY_KEY, dto);

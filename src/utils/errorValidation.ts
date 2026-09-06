import type { ValidationError } from '@/interfaces/base.interface';

export const isValidationErrorArray = (
  error: unknown
): error is ValidationError[] => {
  return (
    Array.isArray(error) &&
    error.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'field' in item &&
        'message' in item &&
        typeof item.field === 'string' &&
        typeof item.message === 'string'
    )
  );
};

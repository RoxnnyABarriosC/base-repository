import { applyDecorators } from '@nestjs/common';
import {
    ApiConsumes,
    ApiOperation,
    ApiProduces
} from '@nestjs/swagger';

/**
 * Composed decorator to apply custom encryption.
 * @returns
 * @param description
 * @param summary
 * @param mimeTypeConsumes
 * @param mimeTypeProduces
 */
export const UseSwagger = (
    summary: string,
    description?: string,
    mimeTypeConsumes = 'application/json',
    mimeTypeProduces = 'application/json'
) =>
{
    return applyDecorators(
        ApiOperation({ description: description ?? summary, summary }),
        ApiConsumes(mimeTypeConsumes),
        ApiProduces(mimeTypeProduces)
        // ApiBadRequestResponse({
        //     description: 'Petición incorrecta.',
        //     type: undefined
        // }),
        // ApiUnauthorizedResponse({
        //     description: 'Sin autorización.',
        //     type: undefined
        // }),
        // ApiInternalServerErrorResponse({
        //     description: 'Error inesperado.',
        //     type: undefined
        // })
    );
};

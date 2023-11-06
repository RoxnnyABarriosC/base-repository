import { Module } from '@nestjs/common';
import { ClsModule, ClsStore } from 'nestjs-cls';

export interface IMyStore extends ClsStore {
    res: {
        metadata: object
        pagination: object
    }
}

@Module({
    imports: [
        ClsModule.forRoot({
            global: true,
            middleware: { mount: true }
        })
    ]
})
export class StoreModule
{ }

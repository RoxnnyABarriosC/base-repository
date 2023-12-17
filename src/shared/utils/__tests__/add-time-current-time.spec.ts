import { addTimeToCurrentDate } from '@shared/utils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { describe, expect, it } from 'vitest';
dayjs.extend(utc);

describe('AddTimeToCurrentDate', () =>
{
    describe('Success', () =>
    {
        describe('with one parameter', () =>
        {
            it('should increase days', () =>
            {
                const currentDate = dayjs().utc();
                const incrementCurrentDate = addTimeToCurrentDate('1d');
                const dateDiff = incrementCurrentDate.diff(currentDate, 'day') >= 1;

                expect(dateDiff).toBe(true);
                expect(incrementCurrentDate instanceof dayjs).toBe(true);
            });

            it('should increase hours', () =>
            {
                const currentDate = dayjs().utc();
                const incrementCurrentDate = addTimeToCurrentDate('1h');
                const dateDiff = incrementCurrentDate.diff(currentDate, 'hour') >= 1;

                expect(dateDiff).toBe(true);
                expect(incrementCurrentDate instanceof dayjs).toBe(true);
            });

            it('should increase minutes', () =>
            {
                const currentDate = dayjs().utc();
                const incrementCurrentDate = addTimeToCurrentDate('2m');
                const dateDiff = incrementCurrentDate.diff(currentDate, 'minute') >= 2;

                expect(dateDiff).toBe(true);
                expect(incrementCurrentDate instanceof dayjs).toBe(true);
            });

            it('should increase seconds', () =>
            {
                const currentDate = dayjs().utc();
                const incrementCurrentDate = addTimeToCurrentDate('2s');
                const dateDiff = incrementCurrentDate.diff(currentDate, 'second') >= 2;

                expect(dateDiff).toBe(true);
                expect(incrementCurrentDate instanceof dayjs).toBe(true);
            });

            it('should increase milliseconds', () =>
            {
                const currentDate = dayjs().utc();
                const incrementCurrentDate = addTimeToCurrentDate('2ms');
                const dateDiff = incrementCurrentDate.diff(currentDate, 'millisecond') >= 2;

                expect(dateDiff).toBe(true);
                expect(incrementCurrentDate instanceof dayjs).toBe(true);
            });
        });

        describe('with two parameters', () =>
        {
            it('should increase entry time with two parameters', () =>
            {
                const currentDate = dayjs().utc();
                const incrementCurrentDate = addTimeToCurrentDate('1h', 1);
                const dateDiff = incrementCurrentDate.diff(currentDate, 'hour') >= 2;
                expect(dateDiff).toBe(true);
            });
        });
    });

    describe('error', () =>
    {
        it('should to be return invalid time format error', () =>
        {
            try
            {
                const incrementCurrentDate = addTimeToCurrentDate('1h12m1s', 1);
            }
            catch (err: any)
            {
                expect(err.message).toBe('Invalid time format');
            }
        });

        it('should to be return invalid unit error', () =>
        {
            try
            {
                const incrementCurrentDate = addTimeToCurrentDate('1ss', 1);
            }
            catch (err: any)
            {
                expect(err.message).toBe('Invalid unit');
            }
        });
    });
});

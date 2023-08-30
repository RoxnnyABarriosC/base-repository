import { addTimeToCurrentDate } from '@shared/utils';
import dayjs from 'dayjs';
import { describe, expect } from 'vitest';

describe('AddTimeToCurrentDate', () =>
{
    it('should increase days', () =>
    {
        const incrementCurrentDate = addTimeToCurrentDate('1d');
        const currentDate = dayjs().utc();
        const dateDiff = incrementCurrentDate.diff(currentDate, 'day') >= 1;

        expect(dateDiff).toBe(true);
        expect(incrementCurrentDate instanceof dayjs).toBe(true);
    });

    it('should increase hours', () =>
    {
        const incrementCurrentDate = addTimeToCurrentDate('1h');
        const currentDate = dayjs().utc();
        const dateDiff = incrementCurrentDate.diff(currentDate, 'hour') >= 1;

        expect(dateDiff).toBe(true);
        expect(incrementCurrentDate instanceof dayjs).toBe(true);
    });

    it('should increase minutes', () =>
    {
        const incrementCurrentDate = addTimeToCurrentDate('2m');
        const currentDate = dayjs().utc();
        const dateDiff = incrementCurrentDate.diff(currentDate, 'minute') >= 2;

        expect(dateDiff).toBe(true);
        expect(incrementCurrentDate instanceof dayjs).toBe(true);
    });

    it('should increase seconds', () =>
    {
        const incrementCurrentDate = addTimeToCurrentDate('2s');
        const currentDate = dayjs().utc();
        const dateDiff = incrementCurrentDate.diff(currentDate, 'second') >= 2;

        expect(dateDiff).toBe(true);
        expect(incrementCurrentDate instanceof dayjs).toBe(true);
    });

    it('should increase milliseconds', () =>
    {
        const incrementCurrentDate = addTimeToCurrentDate('2ms');
        const currentDate = dayjs().utc();
        const dateDiff = incrementCurrentDate.diff(currentDate, 'millisecond') >= 2;

        expect(dateDiff).toBe(true);
        expect(incrementCurrentDate instanceof dayjs).toBe(true);
    });

    it('should increase entry time with two parameters', () =>
    {
        const incrementCurrentDate = addTimeToCurrentDate('1h', 1);
        const currentDate = dayjs().utc();
        const dateDiff = incrementCurrentDate.diff(currentDate, 'hour') >= 2;
        expect(dateDiff).toBe(true);
    });
});

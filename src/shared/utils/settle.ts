/**
 * Returns a promise that is fulfilled with an array of promise state snapshots,
 * but only after all the original promises have settled, i.e. become either fulfilled or rejected.
 */
export const Settle = (promises: Promise<any>[]) =>
{
    return Promise.all(promises.map(p => Promise.resolve(p).then(v => ({
        state: 'fulfilled',
        value: v
    }), r => ({
        state: 'rejected',
        reason: r
    })))).then((results: any[]): any =>
    {
        const rejected = results.find(result => result.state === 'rejected');
        if (rejected)
        {
            return Promise.reject(rejected.reason);
        }

        return results.map(result => result.value);
    });
};

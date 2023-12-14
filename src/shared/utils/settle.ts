/**
 * This function settles an array of promises, returning a promise that resolves to an array of the settled values or rejects with the first rejected reason.
 * @param {Promise<any>[]} promises - The array of promises to be settled.
 * @returns {Promise<any[]>} A promise that resolves to an array of the settled values, or rejects with the first rejected reason.
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


export const SettleV2 = async(promises: Promise<any>[]): Promise<any[]> =>
{
    const results = await Promise.allSettled(promises);

    const rejected = results.find(result => result.status === 'rejected');

    if (rejected)
    {
        return Promise.reject(rejected['reason']);
    }

    return results.map(result => result['value']);
};


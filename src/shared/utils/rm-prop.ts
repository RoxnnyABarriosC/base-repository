
export const RmProp = <a extends object>(obj: a, props: (keyof a)[]) =>
{
    props.forEach(p => delete obj?.[p]);
};

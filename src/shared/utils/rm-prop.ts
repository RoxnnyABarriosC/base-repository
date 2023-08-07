/**
 * Removes the specified properties from an object.
 * @template a - The type of the object.
 * @param {a} obj - The object to remove properties from.
 * @param {(keyof a)[]} props - An array of property names to remove from the object.
 */
export const RmProp = <a extends object>(obj: a, props: (keyof a)[]) =>
{
    props.forEach(p => delete obj?.[p]);
};

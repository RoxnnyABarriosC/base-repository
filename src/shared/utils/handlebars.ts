import hbs from 'handlebars';

hbs.registerHelper('json', function(context)
{
    return JSON.stringify(context);
});

/**
 * This Handlebars helper function converts a context object into a JSON string.
 * @param {object} context - The context object to be converted into a JSON string.
 * @returns {string} The JSON string representation of the context object.
 */
export const handlebars = hbs;

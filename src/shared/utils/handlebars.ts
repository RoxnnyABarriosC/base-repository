import hbs from 'handlebars';

hbs.registerHelper('json', function(context)
{
    return JSON.stringify(context);
});

export const handlebars = hbs;

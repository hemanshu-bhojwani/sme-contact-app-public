const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.businessSchema = Joi.object({
    business: Joi.object({
        name: Joi.string().required().escapeHTML(),
        email: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        contact: Joi.string().required().escapeHTML()
    }).required(),
});

module.exports.employeeSchema = Joi.object({
    employee: Joi.object({
        name: Joi.string().required().escapeHTML(),
        position: Joi.string().required().escapeHTML(),
        email: Joi.string().required().escapeHTML(),
        contact: Joi.string().required().escapeHTML()
    }).required()
})
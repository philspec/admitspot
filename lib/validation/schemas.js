import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const registrationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow(''),
  address: Joi.string().allow(''),
  timezone: Joi.string().required(),
});

export const contactsArraySchema = Joi.array().items(contactSchema);

export function validateLogin(data) {
  return loginSchema.validate(data);
}

export function validateRegistration(data) {
  return registrationSchema.validate(data);
}

export function validateContact(data) {
  return contactSchema.validate(data);
}

export function validateContacts(data) {
  return contactsArraySchema.validate(data);
}
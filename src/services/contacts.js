import { Contact } from '../models/contact.js';

export function getAllContacts() {
  return Contact.find();
}

export async function getPaginatedContacts({ filter, sort, skip, perPage }) {
  const maxPerPage = 100;
  const normalizedPerPage = Math.min(perPage, maxPerPage);

  const contacts = await Contact.find()
    .where(filter)
    .sort(sort)
    .skip(skip)
    .limit(normalizedPerPage)
    .lean();

  const totalItems = await Contact.find().where(filter).countDocuments();

  return {
    contacts,
    totalItems,
  };
}

export async function getContactById(id) {
  return await Contact.findById(id);
}

export async function createContact(data) {
  return await Contact.create(data);
}

export async function updateContact(id, data) {
  return await Contact.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteContact(id) {
  return await Contact.findByIdAndDelete(id);
}

import { Contact } from '../models/contact.js';

export function getAllContacts(userId) {
  return Contact.find({ userId });
}

export async function getPaginatedContacts({
  filter,
  sort,
  skip,
  perPage,
  userId,
}) {
  const maxPerPage = 100;
  const normalizedPerPage = Math.min(perPage, maxPerPage);

  const contacts = await Contact.find({ ...filter, userId })
    .sort(sort)
    .skip(skip)
    .limit(normalizedPerPage)
    .lean();

  const totalItems = await Contact.find({ ...filter, userId }).countDocuments();

  return {
    contacts,
    totalItems,
  };
}

export async function getContactById(id, userId) {
  return await Contact.findOne({ _id: id, userId });
}

export async function createContact(data, userId) {
  return await Contact.create({ ...data, userId });
}

export async function updateContact(id, data, userId) {
  return await Contact.findOneAndUpdate({ _id: id, userId }, data, {
    new: true,
  });
}

export async function deleteContact(id, userId) {
  return await Contact.findOneAndDelete({ _id: id, userId });
}

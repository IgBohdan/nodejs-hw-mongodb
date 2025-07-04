import createError from 'http-errors';
import { Contact } from '../models/contact.js';
import { uploadPhoto } from './cloudinary.js';

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

export async function createContact(payload, userId, file) {
  let photoUrl;
  if (file) {
    photoUrl = await uploadPhoto(file);
  }

  const contact = await Contact.create({
    ...payload,
    userId,
    photo: photoUrl,
  });

  return contact;
}

export async function updateContact(contactId, userId, payload, file) {
  let photoUrl;
  if (file) {
    photoUrl = await uploadPhoto(file);
  }

  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    { ...payload, ...(photoUrl && { photo: photoUrl }) },
    { new: true }
  );

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  return contact;
}

export async function deleteContact(id, userId) {
  return await Contact.findOneAndDelete({ _id: id, userId });
}

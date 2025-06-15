import { Contact } from '../models/contact.js';
export async function getAllContacts() {
  return await Contact.find();
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

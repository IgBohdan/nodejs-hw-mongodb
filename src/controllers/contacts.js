import createError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';

export async function getContacts(req, res) {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function getContactByIdController(req, res, next) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

export async function createContactController(req, res, next) {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createError(
      400,
      'Missing required fields: name, phoneNumber, contactType'
    );
  }

  const contact = await createContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

export async function updateContactController(req, res, next) {
  const { contactId } = req.params;
  const updateData = req.body;

  if (Object.keys(updateData).length === 0) {
    throw createError(400, 'At least one field must be provided for update');
  }

  const contact = await updateContact(contactId, updateData);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
}

export async function deleteContactController(req, res, next) {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
}

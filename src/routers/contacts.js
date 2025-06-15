import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContacts,
  updateContactController,
} from '../controllers/contacts.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', ctrlWrapper(getContactByIdController));
router.post('/', ctrlWrapper(createContactController));
router.patch('/:contactId', ctrlWrapper(updateContactController));
router.delete('/:contactId', ctrlWrapper(deleteContactController));

export const contactsRouter = router;

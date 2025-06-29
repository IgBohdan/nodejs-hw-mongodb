import express from 'express';

import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContacts,
  updateContactController,
} from '../controllers/contacts.js';
import { authenticate } from '../middlewares/authentication.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';

const router = express.Router();

router.use(authenticate);
router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController)
);
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController)
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export const contactsRouter = router;

import createError from 'http-errors';

export function contactQueryParams(query) {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = query;

  const pageNum = parseInt(page, 10);
  const perPageNum = parseInt(perPage, 10);
  const validSortFields = ['name', 'phoneNumber', 'email', 'contactType'];
  const validSortOrders = ['asc', 'desc'];
  const validTypes = ['work', 'home', 'personal'];

  if (isNaN(pageNum) || pageNum < 1) {
    throw createError(400, 'Invalid page number');
  }

  if (isNaN(perPageNum) || perPageNum < 1) {
    throw createError(400, 'Invalid perPage value');
  }

  if (!validSortFields.includes(sortBy)) {
    throw createError(
      400,
      `Invalid sortBy field. Allowed fields: ${validSortFields.join(', ')}`
    );
  }

  if (!validSortOrders.includes(sortOrder)) {
    throw createError(400, 'Invalid sortOrder. Allowed values: asc, desc');
  }

  if (type && !validTypes.includes(type)) {
    throw createError(
      400,
      `Invalid type. Allowed values: ${validTypes.join(', ')}`
    );
  }

  if (isFavourite && !['true', 'false'].includes(isFavourite.toString())) {
    throw createError(
      400,
      'Invalid isFavourite value. Allowed values: true, false'
    );
  }

  const filter = {};
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const skip = (pageNum - 1) * perPageNum;

  return {
    page: pageNum,
    perPage: perPageNum,
    filter,
    sort,
    skip,
  };
}

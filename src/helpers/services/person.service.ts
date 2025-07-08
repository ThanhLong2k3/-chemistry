import { randomUUID } from 'crypto';

import { IBaseSearch } from '@/types/base';
import { createPerson, DeletePerson, getPersonById, searchPerson, updatePerson } from '../repositories/person.repository';
import { IPerson } from './../../types/person.d';

export const createPersonService = async (model: IPerson) => {
  if (!model.name || model.name.trim() === '') {
    throw new Error('Tên thành viên không được để trống');
  }
  if (!model.status || model.status.trim() === '') {
    throw new Error('Trạng thái không được để trống');
  }
  if (!model.user_id || model.user_id.trim() === '') {
    throw new Error('Người dùng không được để trống');
  }

  const PersonId = randomUUID();

  await createPerson({
    ...model,
    id: PersonId,
  });

  return PersonId;
};

export const updatePersonService = async (model: IPerson) => {
  if (!model.name || model.name.trim() === '') {
    throw new Error('Tên thành viên không được để trống');
  }
  if (!model.status || model.status.trim() === '') {
    throw new Error('Trạng thái không được để trống');
  }

  await updatePerson(model);
};

export const searchPersonService = async (model: IBaseSearch) => {
  const results = await searchPerson(model);
  return results;
};

export const deletePersonService = async (PersonId: string) => {
  await DeletePerson(PersonId);
};

export const getPersonByIdService = async (id: string) => { 
  const results = await getPersonById(id);
  return results;
};

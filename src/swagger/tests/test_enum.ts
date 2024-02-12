import { faker } from '@faker-js/faker';

export function mock_enum() {
  const randomNumber = Math.floor(Math.random() * 20) + 1;

  const randomNames = Array.from({ length: randomNumber }, () => faker.color.human());

  return {
    enum: randomNames,
    'x-enumNames': randomNames,
    type: 'string',
  };
}

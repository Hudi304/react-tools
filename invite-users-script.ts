import { UserInviteModel } from '@/common/models/UserInviteModel.model'
// import { inviteUserAsyncApi } from '@api/user.api'
import { InviteStatus } from '@enum/InviteStatus.enum'
import { InviteStep } from '@enum/InviteStep.enum'
import { ShirtSize } from '@enum/ShirtSize.enum'
import { faker } from '@faker-js/faker'

export function generateMockUserInvite(): UserInviteModel {
  const mockUserInvite: UserInviteModel = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    organizationRoleId: faker.string.uuid(),
    phoneNumber: faker.phone.number(),
    step: InviteStep['Form Fill In'],
    organizationStructureReferences: [],
    createdAt: faker.date.anytime().toDateString(),
    updatedAt: faker.date.anytime().toDateString(),
    preferredName: faker.person.firstName(),
    dateOfBirth: faker.date.past().toISOString().split('T')[0], // Format as 'YYYY-MM-DD'
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    shirtSize: faker.helpers.enumValue(ShirtSize),
    isLLC: faker.datatype.boolean(),
    whoRefereedYou: faker.person.firstName(),
    workingAddress: faker.location.streetAddress(),
    status: InviteStatus.New,
  }

  return mockUserInvite
}

export async function create_user(nr: number) {
  for (let i = 0; i < nr; i++) {
    // const user: UserInviteModel = generateMockUserInvite()
    // await inviteUserAsyncApi(user)
    // console.log('Created User', user.firstName)
  }
}

/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPic = /* GraphQL */ `
  mutation CreatePic(
    $input: CreatePicInput!
    $condition: ModelPicConditionInput
  ) {
    createPic(input: $input, condition: $condition) {
      id
      name
      description
      filePath
      like
      owner
      createdAt
      updatedAt
    }
  }
`;
export const updatePic = /* GraphQL */ `
  mutation UpdatePic(
    $input: UpdatePicInput!
    $condition: ModelPicConditionInput
  ) {
    updatePic(input: $input, condition: $condition) {
      id
      name
      description
      filePath
      like
      owner
      createdAt
      updatedAt
    }
  }
`;
export const deletePic = /* GraphQL */ `
  mutation DeletePic(
    $input: DeletePicInput!
    $condition: ModelPicConditionInput
  ) {
    deletePic(input: $input, condition: $condition) {
      id
      name
      description
      filePath
      like
      owner
      createdAt
      updatedAt
    }
  }
`;

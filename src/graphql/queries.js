/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPic = /* GraphQL */ `
  query GetPic($id: ID!) {
    getPic(id: $id) {
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
export const listPics = /* GraphQL */ `
  query ListPics(
    $filter: ModelPicFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPics(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        filePath
        like
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

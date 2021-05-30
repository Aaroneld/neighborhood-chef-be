# Neighborhood Chef

The back-end is deployed on Heroku at ["nhcredux-be.herokuapp.com"]("https://nhcredux-be.herokuapp.com/")

![build](https://github.com/Lambda-School-Labs/neighborhood-chef-be/workflows/build/badge.svg)
<a href="https://codeclimate.com/github/Aaroneld/neighborhood-chef-be/maintainability"><img src="https://api.codeclimate.com/v1/badges/3cd3e60d599dcbfebc58/maintainability" /></a>
<a href="https://codeclimate.com/github/Aaroneld/neighborhood-chef-be/test_coverage"><img src="https://api.codeclimate.com/v1/badges/3cd3e60d599dcbfebc58/test_coverage" /></a>
![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg)

## Contributors

|                                                          [Kyle Richardson](https://github.com/kyle-richardson)                                                           |                                                           [Paul Edwards](https://github.com/PaulMEdwards)                                                           |                                                      [Aaron Merrifield-Lucier](https://github.com/Aaroneld)                                                       |                                                          [Brennan Neilson](https://github.com/bvneilson)                                                           |                                                          [Patrick Replogle](https://github.com/patrick-replogle)                                                          |                                                            [Miguel Leal](https://twitter.com/lealitos)                                                             |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| [<img src="https://avatars3.githubusercontent.com/u/52683176?s=400&u=864097615ff093d54d380d2d7d9d36bc0aebf60b&v=4" width = "200" />](https://github.com/kyle-richardson) | [<img src="https://avatars1.githubusercontent.com/u/153847?s=400&u=9ce092b1023143bff17fd34191c0768a1f8fe5ea&v=4" width = "200" />](https://github.com/PaulMEdwards) | [<img src="https://avatars2.githubusercontent.com/u/52682445?s=400&u=158e754213409df82f96c0f9f9a52821e9c81d1d&v=4" width = "200" />](https://github.com/Aaroneld) | [<img src="https://avatars3.githubusercontent.com/u/12500686?s=400&u=9ab949e147ba9fe8c58fe50a891c3daf8dcd21b4&v=4" width = "200" />](https://github.com/bvneilson) | [<img src="https://avatars2.githubusercontent.com/u/50844285?s=400&u=7ffa88c4c221bf888b1771fec72530ac156d90c6&v=4" width = "200" />](https://github.com/patrick-replogle) | [<img src="https://avatars3.githubusercontent.com/u/50895333?s=400&u=26d4e7b29f44be371e3dffec0aff81c960937093&v=4" width = "200" />](https://twitter.com/lealitos) |
|                                       [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/kyle-richardson)                                       |                                      [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/PaulMEdwards)                                      |                                       [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/Aaroneld)                                       |                                       [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/bvneilson)                                       |                                       [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/patrick-replogle)                                       |                                      [<img src="https://twitter.com/favicon.ico" width="15"> ](https://twitter.com/lealitos)                                       |
|                      [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://linkedin.com/in/kyle-m-richardson)                       |                    [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/paulmedwards/)                    |            [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/aaron-merrifield-234477195/)            |                  [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/brennanneilson/)                   |                [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/patrick-replogle-409a92193/)                |               [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/miguel-leal-6b6905168/)               |

# API Documentation

## Getting started

To get the server running locally:

- Clone this repo
- **yarn or npm install** to install all required dependencies
- **Install Postgres Docker** (see section of same name) to setup PostgreSQL Docker development instance
- **yarn server** to start the local server

Testing:

- **yarn test** to start server using testing environment
- **yarn test:watch** to continuously use testing environment
- **yarn test:watchTroubleshoot** to debug while using testing environment
- **yarn test:watchWithLogs** to view logs while using testing environment
- **yarn coverage** to view test coverage

### Backend framework

- Node
- Express
- Graphql
- Knex
- Heroku
- PostgreSQL

## Graphql Queries and Mutations

#### User

| Type     | Name                | variables                    | Description                             |
| -------- | ------------------- | ---------------------------- | --------------------------------------- |
| Query    | Users               | (queryParams: UserInput)     | Returns all users                       |
| Mutation | inputUser           | (input: UserInput!)          | Adds a new user or updates user account |
| Mutation | removeUser          | (id: ID!)                    | Deletes a user account                  |
| Mutation | favoriteEventInput  | (input: FavoriteEventInput!) | Adds an event to user's favorite list   |
| Mutation | removeFavoriteEvent | (input: FavoriteEventInput!) | Removes event from user's favorite list |

#### Event

| Type     | Name              | variables                                   | Description              |
| -------- | ----------------- | ------------------------------------------- | ------------------------ |
| Query    | Events            | (queryParams: EventInput, currentUser: Int) | Returns all events       |
| Mutation | inputEvent        | (input: EventInput!)                        | Add/update an event      |
| Mutation | removeEvent       | (id: ID!)                                   | Deletes an event         |
| Mutation | inputEventInvite  | (inviteInput: EventInviteInput!)            | Invites user to event    |
| Mutation | updateInvitation  | (input: UpdateInviteInput!)                 | Update invitation status |
| Mutation | removeEventInvite | (inviteInput: EventInviteInput!)            | Deletes an invitation    |
| Mutation | inputComment      | (comment: CommentInput!)                    | Add comment to event     |
| Mutation | removeComment     | (id: ID!)                                   | Delete a comment         |
| Mutation | handleReaction    | (reaction: ReactionInput!)                  | React to a comment       |
| Mutation | inputEventStatus  | (eventStatus: EventStatusInput!)            | RSVP to event            |
| Mutation | removeEventStatus | (event_id: Int!, user_id: Int!)             | Remove RSVP              |

#### Comments

| Type     | Name                | variables                          | Description                                    |
| -------- | ------------------- | ---------------------------------- | ---------------------------------------------- | ---------------------- |
| Query    | getEventComments    | (id: ID!)                          | Returns all event comments                     |
| Query    | getCommentReactions | (id: ID!)                          | Returns all comment reactions                  |
| Mutation | addComment          | (id: ID!)                          | (input: !NewCommentInput)                      | Returns create comment |
| Mutation | updateComment       | (id: ID!, input: !NewCommentInput) | Returns updated comment                        |
| Mutation | removeComment       | (id: ID!)                          | Returns deleted comment                        |
| Mutation | handleReaction      | (input: ReactionInput!)            | Dynamically adds, updates, or deletes reaction |

# Data Model

#### User Type and Inputs

```graphql
type User {
  id: ID!
  email: String!
  firstName: String!
  lastName: String!
  gender: String
  address: String!
  latitude: Float!
  longitude: Float!
  photo: String
  status: String
  UserEvents: UserEvents
  biography: String
}
```

```graphql
input UserInput {
  id: ID
  email: String
  firstName: String
  lastName: String
  gender: String
  address: String
  latitude: Float
  longitude: Float
  radius: Int
  photo: String
  activated: Boolean
  biography: String
}
```

#### Event Type and Inputs

```graphql
type Event {
  id: ID
  createDateTime: String
  startTime: String!
  endTime: String
  title: String!
  description: String!
  User: User!
  photo: String
  category: String
  modifiers: [String]
  hashtags: [String]
  dietaryWarnings: [String]
  allergenWarnings: [String]
  address: String!
  latitude: Float!
  longitude: Float!
  Comments: [Comment]!
  EventUsers: EventUsers!
  status: Status!
}
```

```graphql
input EventInput {
  id: ID
  createDateTime: String
  startTime: String
  endTime: String
  title: String
  description: String
  user_id: Int
  photo: String
  category: String
  modifiers: [String]
  hashtags: [String]
  dietaryWarnings: [String]
  allergenWarnings: [String]
  address: String
  latitude: Float
  longitude: Float
  status: Status
}
```

#### EventInvite Inputs

```graphql
input EventInviteInput {
  event_id: Int!
  inviter_id: Int!
  user_id: Int!
}
```

#### comment/reactions Type and Inputs

```graphql
type Comment {
  id: ID!
  event_id: Int!
  parent: User
  root_id: Int
  dateCreated: String!
  comment: String!
  Reactions: [Reaction]
  User: User!
  Parent: User
  Subcomments: [Comment]
}
```

```graphql
input CommentInput {
  event_id: Int
  user_id: Int
  parent_id: Int
  root_id: Int
  dateCreated: String
  comment: String
}
```

```graphql
type Reaction {
  comment_id: Int!
  user_id: Int!
  reaction: String!
}
```

```graphql
input ReactionInput {
  comment_id: Int
  user_id: Int
  reaction: String
}
```

## Environment Variables

In order for the app to function correctly, the user must set up their own environment variables. Please refer to the .env.example file contained within the src folder for a list of up to date environment variables with examples.

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

- Check first to see if your issue has already been reported.
- Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
- Create a live example of the problem.
- Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

- Ensure any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## Documentation

See [Frontend Documentation](https://github.com/Lambda-School-Labs/neighborhood-chef-fe/blob/master/README.md) for details on the frontend of our project.

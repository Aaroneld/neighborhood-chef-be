const gql = require('graphql-tag');

const typeDefs = gql`
  scalar JSON

  type UserEvents {
    owned: [Event]!
    attending: [Event]!
    invited: [Event]!
    favorited: [Int]!
    local(mileRadius: Int!): [Event]!
  }

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

  type EventUsers {
    attending: [User]!
    # maybeGoing: [User]!
    invited: [User]!
    currentUserInvited: [User]
  }

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

  input FavoriteEventInput {
    event_id: Int!
    user_id: Int!
  }

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

  input CommentInput {
    event_id: Int
    user_id: Int
    parent_id: Int
    root_id: Int
    dateCreated: String
    comment: String
  }

  type Reaction {
    comment_id: Int!
    user_id: Int!
    reaction: String!
  }

  input ReactionInput {
    comment_id: Int
    user_id: Int
    reaction: String
  }

  enum Status {
    UNDECIDED
    NOT_GOING
    MAYBE_GOING
    GOING
  }

  type EventStatus {
    id: ID!
    event_id: Int!
    status: Status!
    user_id: Int!
  }

  input EventStatusInput {
    event_id: Int!
    status: Status!
    user_id: Int!
  }

  input EventInviteInput {
    event_id: Int!
    inviter_id: Int!
    user_id: Int!
  }

  type Query {
    Status: String!
    Users(queryParams: UserInput): [User]!
    Events(queryParams: EventInput, currentUser: Int): [Event]!
  }

  type Mutation {
    inputUser(input: UserInput!): User!
    removeUser(id: ID!): User!
    inputEvent(input: EventInput!): Event!
    removeEvent(id: ID!): Event!
    inputEventStatus(eventStatus: EventStatusInput!): Event!
    removeEventStatus(event_id: Int!, user_id: Int!): EventStatus!
    inputComment(comment: CommentInput!): Comment!
    removeComment(id: ID!): Comment!
    handleReaction(reaction: ReactionInput!): [Reaction!]
    favoriteEventInput(favoriteEvent: FavoriteEventInput!): Event!
    removeFavoriteEvent(favoriteEvent: FavoriteEventInput!): Event!
    inputEventInvite(inviteInput: EventInviteInput!): Boolean!
    removeEventInvite(inviteInput: EventInviteInput!): Boolean!
  }
`;

module.exports = typeDefs;

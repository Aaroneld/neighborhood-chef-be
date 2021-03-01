const { gql } = require('apollo-server-express');

const typeDefs = gql`
    scalar JSON

    type UserEvents {
        owned: [Event]!
        attending: [Event]!
        invited: [Event]!
        favorited: [Event]!
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
        events: UserEvents
    }



    input UserInput {
        id: ID
        email: String!
        firstName: String!
        lastName: String!
        gender: String
        address: String!
        latitude: Float!
        longitude: Float!
        photo: String
    }

    type Event {
        id: ID
        createDateTime: String
        startTime: String!
        endTime: String
        title: String!
        description: String!
        owner: User!
        photo: String
        category: String
        modifiers: [String]
        hashtags: [String]
        dietaryWarnings: [String]
        allergenWarnings: [String]
        address: String!
        latitude: Float!
        longitude: Float!
        comments: [Comment]!
    }

    input EventInput {
        id: ID
        createDateTime: String
        startTime: String!
        endTime: String
        title: String!
        description: String!
        user_id: Int!
        photo: String
        category: String
        modifiers: [String]
        hashtags: [String]
        dietaryWarnings: [String]
        allergenWarnings: [String]
        address: String!
        latitude: Float!
        longitude: Float!
    }

    input EventInviteInput {
        event_id: Int!
        user_id: Int!
        inviter_id: Int!
        status: String!
    }

    input RemoveInviteInput {
        event_id: Int!
        user_id: Int!
    }

    input FavoriteEventInput {
        event_id: Int!
        user_id: Int!
    }

    input RemoveFavoriteEventInput {
        event_id: Int!
        user_id: Int!
    }

    type Comment {
        id: ID!
        event_id: Int!
        user_id: Int!
        parent_id: Int!
        root_id: Int!
        dateCreated: String!
        comment: String!
        Reactions [Reaction]
        user: User!
    }

    input CommentInput {
        id: ID
        event_id: Int!
        user_id: Int!
        parent_id: Int!
        root_id: Int!
        dateCreated: String!
        comment: String!
    }

    type Reaction {
        comment_id: Int!
        user_id: Int!
        reaction: String!
    }

    input ReactionInput {
        comment_id: Int!
        user_id: Int!
        reaction: String!
    }

    type Query {
        status: String!
        Users: [User]! 
        Events: [Event]!
    }

    enum Status {
        Not Approved 
        Approved
        Not Going
        Maybe Going
        Going
    }

    type Mutation {
        inputUser(input: UserInput!): User!
        removeUser(id: ID!): User!
        inputEvent(input: EventInput!): Event!
        removeEvent(id: ID!): Event!
    }
`;

module.exports = typeDefs;

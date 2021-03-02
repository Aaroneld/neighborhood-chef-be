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
        id: Int
        email: String
        firstName: String
        lastName: String
        gender: String
        address: String
        latitude: Float
        longitude: Float
        photo: String
        activated: Bool
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
    }

    input FavoriteEventInput {
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
        Not Approved 
        Approved
        Not Going
        Maybe Going
        Going
    }

    type EventStatus {
        event_d: Event! 
        status: Status!
        inviter_id: User!
        user_id: User!
    }

    input EventStatusInput {
        event_id: int!
        status: Status!
        inviter_id: Int!
        user_id: Int!
    }


    type Query {
        status: String!
        Users(queryParams: UserInput): [User]! 
        Events(queryParams: EventInput): [Event]!
        EventStatuses(queryParams: EventStatusInput): [EventStatus]!
        FavoriteEvents(queryParams: FavoriteEventInput): [FavoriteEvents]!
        Comments(queryParams: CommentInput): [Comment]!
    }

    type Successful: Bool!

    type Mutation {
        inputUser(input: UserInput!)
        removeUser(id: ID!)
        inputEvent(input: EventInput!)
        removeEvent(id: ID!)
        inputEventStatus(eventStatus: EventStatusInput)
        removeEventStatus(event_id: Int! user_id: int!)
        inputComment(comment: CommentInput)
        removeComment(id: ID!)
        inputReaction(reaction: ReactionInput)
        removeReaction(id: ID!)
        favoriteEventInput(favoriteEvent: favoriteEventInput)
        removeFavoriteEvent(user: Int! event: Int!)
    }
`;

module.exports = typeDefs;

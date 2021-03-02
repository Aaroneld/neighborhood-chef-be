const gql = require('graphql-tag');

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
        UserEvents: UserEvents
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
        photo: String
        activated: Boolean
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
    }

    type EventUsers {
        attending: [User]!
        invited: [User]!
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
        Reactions: [Reaction]
        User: User!
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
        Not_Approved
        Approved
        Not_Going
        Maybe_Going
        Going
    }

    type EventStatus {
        event_d: Event!
        status: Status!
        inviter_id: User!
        user_id: User!
    }

    input EventStatusInput {
        event_id: Int!
        status: Status!
        inviter_id: Int!
        user_id: Int!
    }

    type Query {
        Status: String!
        Users(queryParams: UserInput): [User]!
        Events(queryParams: EventInput): [Event]!
        # EventStatuses(queryParams: EventStatusInput): [EventStatus]!
        # FavoriteEvents(queryParams: FavoriteEventInput): [Event]!
        # Comments(queryParams: CommentInput): [Comment]!
    }

    type Mutation {
        inputUser(input: UserInput!): User!
        removeUser(id: ID!): User!
        inputEvent(input: EventInput!): Event!
        removeEvent(id: ID!): Event!
        inputEventStatus(eventStatus: EventStatusInput): Boolean
        removeEventStatus(event: Int!, invitee: Int!): Boolean
        inputComment(comment: CommentInput): Boolean
        removeComment(id: ID!): Boolean
        inputReaction(reaction: ReactionInput): Boolean
        removeReaction(id: ID!): Boolean
        favoriteEventInput(favoriteEvent: FavoriteEventInput): Boolean
        removeFavoriteEvent(user: Int!, event: Int!): Boolean
    }
`;

module.exports = typeDefs;

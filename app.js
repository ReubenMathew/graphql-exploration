const express = require('express');
const bodyParser = require('body-parser');

const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');


const app = express();

const events = [];


app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`

        type Event{
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery{
            events: [Event!]!
        }

        type RootMutation{
            createEvent(eventInput: EventInput): Event
        }

        schema{
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: (args) => {
            return events;
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            };
            console.log(args);
            events.push(event);
            return event;
        }
    },
    graphiql: true
    })
);


mongoose.connect(`mongodb+srv://${
    process.env.MONGO_USER
}:${
    process.env.MONGO_PASSWORD
}@cluster0-cu8yy.mongodb.net/test?retryWrites=true`
).then(() => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});




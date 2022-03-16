const fs = require('fs');
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost/issuetracker';

// Atlas URL  - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb+srv://UUU:PPP@cluster0-XXX.mongodb.net/issuetracker?retryWrites=true';

// mLab URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb://UUU:PPP@XXX.mlab.com:33533/issuetracker';

let db;

let aboutMessage = "Issue Tracker API v1.0";

const GraphQLDate = new GraphQLScalarType({
  name: 'GraphQLDate',
  description: 'A Date() type in GraphQL as a scalar',
  serialize(value) {
    return value.toISOString();
  },
  parseValue(value) {
    const dateValue = new Date(value);
    return isNaN(dateValue) ? undefined : dateValue;
  },
  parseLiteral(ast) {
    if (ast.kind == Kind.STRING) {
      const value = new Date(ast.value);
      return isNaN(value) ? undefined : value;
    }
  },
});

const resolvers = {
  Query: {
    about: () => aboutMessage,
    issueList,
    reservationlist,
    blacklist,
  },
  Mutation: {
    setAboutMessage,
    issueAdd,
    passengerAdd,
    blacklistAdd,
    passengerRemove,
  },
  GraphQLDate,
};

//EDITS STARTS HERE
async function reservationlist() {
	const passengers = await db.collection('reservationlist').find({}).toArray();
	return passengers;
}

async function blacklist() {
	const passengersBlackListed = await db.collection('blacklist').find({}).toArray();
	return passengersBlackListed;
}
async function getNextPassengerNumber(name) {
	const result = await db.collection('passengercounter').findOneAndUpdate(
	  { _id: name },
	  { $inc: { current: 1 } },
	  { returnOriginal: false },
	);
	return result.value.current;
}
async function getNextBlacklistedPassengerNumber(name) {
	const result = await db.collection('blacklistedpassengercounter').findOneAndUpdate(
	  { _id: name },
	  { $inc: { current: 1 } },
	  { returnOriginal: false },
	);
	return result.value.current;
}


async function passengerAdd(_, { passenger }) {
  console.log("look here")
  console.log("Hi right time now now here",passenger)
  console.log('I am testing this',await db.collection('reservationlist').findOne(passenger))
  if (await db.collection('reservationlist').findOne(passenger)!=null){throw new UserInputError('No duplicate entry')}
  else if(await db.collection('blacklist').findOne(passenger)!=null){console.log("in blacklist");
    throw new UserInputError('Passenger is blacklisted')}
  else{
	console.log("hello UnitedArab testing")
	passenger.created = new Date();
	passenger.id = await getNextPassengerNumber('passengerCount');
      
	const result = await db.collection('reservationlist').insertOne(passenger);
	const savedIssue = await db.collection('reservationlist')
	  .findOne({ _id: result.insertedId });
    console.log(db.collection('reservationlist').find(passenger))
	return savedIssue;}
  

}

//passengerBlacklist in line 94 must be the same as the one in graphql where you define 
async function blacklistAdd(_, { blacklistpassenger }) {
	// issueValidate(issue);
  if (await db.collection('blacklist').findOne(blacklistpassenger)!=null){throw new UserInputError('No duplicate entry')}
	else{
    console.log("here u go charles")
  blacklistpassenger.created = new Date();
	blacklistpassenger.id = await getNextBlacklistedPassengerNumber('blacklistedPassengerCount');
      
	const result = await db.collection('blacklist').insertOne(blacklistpassenger);
	const savedIssue = await db.collection('blacklist')
	  .findOne({ _id: result.insertedId });
	return savedIssue;}
}


async function passengerRemove(_, { passenger }) {
	// issueValidate(issue);
  const clientName= passenger.passengerName
	const result = await db.collection('reservationlist').deleteOne({passengerName:passenger.passengerName});
	// const savedIssue = await db.collection('blacklist')
	//   .findOne({ _id: result.insertedId });
	// return savedIssue;
}

//EDITS ENDS HERE

function setAboutMessage(_, { message }) {
  return aboutMessage = message;
}

async function issueList() {
  const issues = await db.collection('issues').find({}).toArray();
  return issues;
}

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}


function passengerValidate(passenger) {
  const errors = [];
  // const verify=db.
  if (passenger.title.length < 3) {
    errors.push('Field "title" must be at least 3 characters long.');
  }
  if (issue.status === 'Assigned' && !issue.owner) {
    errors.push('Field "owner" is required when status is "Assigned"');
  }
  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
}

function issueValidate(issue) {
  const errors = [];

  if (issue.title.length < 3) {
    errors.push('Field "title" must be at least 3 characters long.');
  }
  if (issue.status === 'Assigned' && !issue.owner) {
    errors.push('Field "owner" is required when status is "Assigned"');
  }
  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
}

async function issueAdd(_, { issue }) {
  issueValidate(issue);
  issue.created = new Date();
  issue.id = await getNextSequence('issues');

  const result = await db.collection('issues').insertOne(issue);
  const savedIssue = await db.collection('issues')
    .findOne({ _id: result.insertedId });
  return savedIssue;
}

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
});

const app = express();

app.use(express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });

(async function () {
  try {
    await connectToDb();
    app.listen(3000, function () {
      console.log('App started on port 3000');
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
})();
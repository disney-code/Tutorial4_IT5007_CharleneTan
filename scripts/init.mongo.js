/*
 * Run using the mongo shell. For remote databases, ensure that the
 * connection string is supplied in the command line. For example:
 * localhost:
 *   mongo issuetracker scripts/init.mongo.js
 * Atlas:
 *   mongo mongodb+srv://user:pwd@xxx.mongodb.net/issuetracker scripts/init.mongo.js
 * MLab:
 *   mongo mongodb://user:pwd@xxx.mlab.com:33533/issuetracker scripts/init.mongo.js
 */

db.reservationlist.remove({});
db.blacklist.remove({});
db.passengercounter.remove({});
db.blacklistedpassengercounter.remove({});

const initialPassenger = [
	{
	  id: 1,  passengerName: 'Charlene', 
	  created: new Date('2019-01-15'),mobile: 94593602
	},
	{
		id: 2,  passengerName: 'Charlotte', 
		created: new Date('2019-01-15'),mobile: 99865234
	},
      ];

const initialblacklistedPassengers = [
	{
	  id: 1,  passengerName: 'Jacob', 
	  created: new Date('2019-01-15'),mobile: 89653546
	},
	{
		id: 2,  passengerName: 'Joel', 
		created: new Date('2019-01-15'),mobile: 96542365
	},
      ];

db.reservationlist.insertMany(initialPassenger);
const countPassenger = db.reservationlist.count();
db.passengercounter.insert({ _id: 'passengerCount', current: countPassenger });

db.blacklist.insertMany(initialblacklistedPassengers);
const countblacklistedPassenger = db.blacklist.count();
db.blacklistedpassengercounter.insert({ _id: 'blacklistedPassengerCount', current: countblacklistedPassenger });





db.reservationlist.createIndex({ id: 1 }, { unique: true });
db.reservationlist.createIndex({ passengerName: 1 });
db.reservationlist.createIndex({ mobile: 1 });




// db.issues.remove({});

// const issuesDB = [
//   {
//     id: 1, status: 'New', owner: 'Ravan', effort: 5,
//     created: new Date('2019-01-15'), due: undefined,
//     title: 'Error in console when clicking Add',
//   },
//   {
//     id: 2, status: 'Assigned', owner: 'Eddie', effort: 14,
//     created: new Date('2019-01-16'), due: new Date('2019-02-01'),
//     title: 'Missing bottom border on panel',
//   },
// ];

// db.issues.insertMany(issuesDB);
// const count = db.issues.count();
// print('Inserted', count, 'issues');

// db.counters.remove({ _id: 'issues' });
// db.counters.insert({ _id: 'issues', current: count });

// db.issues.createIndex({ id: 1 }, { unique: true });
// db.issues.createIndex({ status: 1 });
// db.issues.createIndex({ owner: 1 });
// db.issues.createIndex({ created: 1 });
const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}


/*EDITS TO CODE STARTS HERE
*/
function ReservationListRow(props) {
	const passenger = props.passenger;
	return (
	  <tr>
	    <td>{passenger.id}</td>
	    <td>{passenger.passengerName}</td>
	    <td>{passenger.created.toDateString()}</td>
	    <td>{passenger.mobile}</td>
	  </tr>
	);
      }

function ReservationListTable(props) {
	const passengerRow = props.passengers.map(passenger =>
	  <ReservationListRow key={passenger.id} passenger={passenger} />
	);
      
	return (
	  <table className="bordered-table">
      
	    <thead>
	      <tr>
		<th>ID</th>
		<th>Name</th>
		<th>Booking Date</th>
		<th>Mobile</th>
		
	      </tr>
	    </thead>
	    <tbody>
	      {passengerRow}
	    </tbody>
	  </table>
	);
      }

/*Code for blacklist starts here */
      
function BlackListRow(props) {
	const passenger = props.passenger;
	return (
	  <tr>
	    <td>{passenger.id}</td>
	    <td>{passenger.passengerName}</td>
	    <td>{passenger.created.toDateString()}</td>
	    <td>{passenger.mobile}</td>
	  </tr>
	);
      }

function BlackListTable(props) {
	const blacklistpassengerRow = props.blacklistedpassengers.map(passenger =>
	  <BlackListRow key={passenger.id} passenger={passenger} />
	);
      
	return (
	  <table className="bordered-table">
      
	    <thead>
	      <tr>
		<th>ID</th>
		<th>Name</th>
		<th>Booking Date</th>
		<th>Mobile</th>
		
	      </tr>
	    </thead>
	    <tbody>
	      {blacklistpassengerRow}
	    </tbody>
	  </table>
	);
      }






/**Code for blacklist ends here */
class PassengerAdd extends React.Component {
	constructor() {
	  super();
	  this.handleSubmit = this.handleSubmit.bind(this);
	}
      
	handleSubmit(e) {
	  e.preventDefault();
	  const form = document.forms.passengerAdd;
	  const passenger = {
	    passengerName: form.passengerName.value, mobile: form.passengerMobile.value,
	    
	  }
	  this.props.createPassenger(passenger);
	  form.passengerName.value = ""; form.passengerMobile.value = "";
	}
      
	render() {
	  return (
	    <form name="passengerAdd" onSubmit={this.handleSubmit}>
	      <input type="text" name="passengerName" placeholder="Name" />
	      <input type="number" name="passengerMobile" placeholder="Mobile Number" />
	      <button>Add</button>
	    </form>
	  );
	}
      }



class PassengerDelete extends React.Component {
        constructor() {
          super();
          this.handleSubmit = this.handleSubmit.bind(this);
        }
            
        handleSubmit(e) {
          e.preventDefault();
          const form = document.forms.passengerDelete;
          const passenger = {
            passengerName: form.passengerName.value, mobile: form.passengerMobile.value,
            
          }
          this.props.deletePassenger(passenger);
          form.passengerName.value = ""; form.passengerMobile.value = "";
        }
            
        render() {
          return (
            <form name="passengerDelete" onSubmit={this.handleSubmit}>
              <input type="text" name="passengerName" placeholder="Name" />
              <input type="number" name="passengerMobile" placeholder="Mobile Number" />
              <button>Delete</button>
            </form>
          );
        }
            }




class BlacklistedPassengerAdd extends React.Component {
        constructor() {
          super();
          this.handleSubmit = this.handleSubmit.bind(this);
        }
            
        handleSubmit(e) {
          e.preventDefault();
          const form = document.forms.blacklistedpassengerAdd;
          const passenger = {
            passengerName: form.passengerName.value, mobile: form.passengerMobile.value,
            
          }
          this.props.createBlacklistedPassenger(passenger);
          form.passengerName.value = ""; form.passengerMobile.value = "";
        }
            
        render() {
          return (
            <form name="blacklistedpassengerAdd" onSubmit={this.handleSubmit}>
              <input type="text" name="passengerName" placeholder="Blacklist Name" />
              <input type="number" name="passengerMobile" placeholder="Mobile Number" />
              <button>Add</button>
            </form>
          );
        }
            }

/*EDITS TO CODE ENDS HERE
*/
async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables })
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}

class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { passengers: [] ,blacklistedpassengers:[]};
    this.createPassenger = this.createPassenger.bind(this);
    this.deletePassenger = this.deletePassenger.bind(this);
    this.createBlacklistedPassenger=this.createBlacklistedPassenger.bind(this);
  }

  /*Edit starts here */
componentDidMount() {
	this.loadData();
  this.loadData2();
      }
async loadData() {
	const query = `query {
	  reservationlist {
	    id passengerName created mobile 
	  }
	}`;

	const data = await graphQLFetch(query);
  

	if (data) {
	  this.setState({ passengers: data.reservationlist });
	}
}


async loadData2() {
	const query = `query {
	  blacklist {
	    id passengerName created mobile 
	  }
	}`;
    
	const data2 = await graphQLFetch(query);
	if (data2) {
	  this.setState({ blacklistedpassengers: data2.blacklist });
	}
}


async createPassenger(passenger) {
	const query = `mutation passengerAdd($passenger: PassengerInputs!) {
		passengerAdd(passenger: $passenger) {
	    id
	  }
	}`;
    
	const data = await graphQLFetch(query, { passenger });
	if (data) {
	  this.loadData();
	}
      }


async deletePassenger(passenger) {
        const query = `mutation passengerRemove($passenger: PassengerInputs!) {
          passengerRemove(passenger: $passenger) {
            id
          }
        }`;
          
        const data = await graphQLFetch(query, { passenger });
        if (data) {
          this.loadData();
        }
            }

async createBlacklistedPassenger(blacklistpassenger) {
              const query = `mutation blacklistAdd($blacklistpassenger: PassengerInputs!) {
                blacklistAdd(blacklistpassenger: $blacklistpassenger) {
                  id
                }
              }`;
                
              const data = await graphQLFetch(query, { blacklistpassenger });
              if (data) {
                this.loadData2();
              }
                  }
/*Edit ends here */


  render() {
    return (
      <React.Fragment>
        <h1>Welcome To Singapore Railway</h1>
        <hr />
        <h1>Reservation List</h1>
	<ReservationListTable passengers={this.state.passengers}/>
      <br/>  
	<PassengerAdd createPassenger={this.createPassenger}/>
  <br/>  
  <PassengerDelete deletePassenger={this.deletePassenger}/><br/>  
  <hr />

  <h1>Blacklist</h1>
  <BlackListTable blacklistedpassengers={this.state.blacklistedpassengers}/>
  <br/>  
  <BlacklistedPassengerAdd createBlacklistedPassenger={this.createBlacklistedPassenger}/>
  <br/>  
      </React.Fragment>
    );
  }
}

const element = <IssueList />;

ReactDOM.render(element, document.getElementById('contents'));
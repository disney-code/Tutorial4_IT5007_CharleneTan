const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}
/*EDITS TO CODE STARTS HERE
*/


function ReservationListRow(props) {
  const passenger = props.passenger;
  return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, passenger.id), /*#__PURE__*/React.createElement("td", null, passenger.passengerName), /*#__PURE__*/React.createElement("td", null, passenger.created.toDateString()), /*#__PURE__*/React.createElement("td", null, passenger.mobile));
}

function ReservationListTable(props) {
  const passengerRow = props.passengers.map(passenger => /*#__PURE__*/React.createElement(ReservationListRow, {
    key: passenger.id,
    passenger: passenger
  }));
  return /*#__PURE__*/React.createElement("table", {
    className: "bordered-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "ID"), /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Booking Date"), /*#__PURE__*/React.createElement("th", null, "Mobile"))), /*#__PURE__*/React.createElement("tbody", null, passengerRow));
}
/*Code for blacklist starts here */


function BlackListRow(props) {
  const passenger = props.passenger;
  return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, passenger.id), /*#__PURE__*/React.createElement("td", null, passenger.passengerName), /*#__PURE__*/React.createElement("td", null, passenger.created.toDateString()), /*#__PURE__*/React.createElement("td", null, passenger.mobile));
}

function BlackListTable(props) {
  const blacklistpassengerRow = props.blacklistedpassengers.map(passenger => /*#__PURE__*/React.createElement(BlackListRow, {
    key: passenger.id,
    passenger: passenger
  }));
  return /*#__PURE__*/React.createElement("table", {
    className: "bordered-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "ID"), /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Booking Date"), /*#__PURE__*/React.createElement("th", null, "Mobile"))), /*#__PURE__*/React.createElement("tbody", null, blacklistpassengerRow));
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
      passengerName: form.passengerName.value,
      mobile: form.passengerMobile.value
    };
    this.props.createPassenger(passenger);
    form.passengerName.value = "";
    form.passengerMobile.value = "";
  }

  render() {
    return /*#__PURE__*/React.createElement("form", {
      name: "passengerAdd",
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "passengerName",
      placeholder: "Name"
    }), /*#__PURE__*/React.createElement("input", {
      type: "number",
      name: "passengerMobile",
      placeholder: "Mobile Number"
    }), /*#__PURE__*/React.createElement("button", null, "Add"));
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
      passengerName: form.passengerName.value,
      mobile: form.passengerMobile.value
    };
    this.props.deletePassenger(passenger);
    form.passengerName.value = "";
    form.passengerMobile.value = "";
  }

  render() {
    return /*#__PURE__*/React.createElement("form", {
      name: "passengerDelete",
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "passengerName",
      placeholder: "Name"
    }), /*#__PURE__*/React.createElement("input", {
      type: "number",
      name: "passengerMobile",
      placeholder: "Mobile Number"
    }), /*#__PURE__*/React.createElement("button", null, "Delete"));
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
      passengerName: form.passengerName.value,
      mobile: form.passengerMobile.value
    };
    this.props.createBlacklistedPassenger(passenger);
    form.passengerName.value = "";
    form.passengerMobile.value = "";
  }

  render() {
    return /*#__PURE__*/React.createElement("form", {
      name: "blacklistedpassengerAdd",
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "passengerName",
      placeholder: "Blacklist Name"
    }), /*#__PURE__*/React.createElement("input", {
      type: "number",
      name: "passengerMobile",
      placeholder: "Mobile Number"
    }), /*#__PURE__*/React.createElement("button", null, "Add"));
  }

}
/*EDITS TO CODE ENDS HERE
*/


async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
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
    this.state = {
      passengers: [],
      blacklistedpassengers: []
    };
    this.createPassenger = this.createPassenger.bind(this);
    this.deletePassenger = this.deletePassenger.bind(this);
    this.createBlacklistedPassenger = this.createBlacklistedPassenger.bind(this);
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
      this.setState({
        passengers: data.reservationlist
      });
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
      this.setState({
        blacklistedpassengers: data2.blacklist
      });
    }
  }

  async createPassenger(passenger) {
    const query = `mutation passengerAdd($passenger: PassengerInputs!) {
		passengerAdd(passenger: $passenger) {
	    id
	  }
	}`;
    const data = await graphQLFetch(query, {
      passenger
    });

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
    const data = await graphQLFetch(query, {
      passenger
    });

    if (data) {
      this.loadData();
    }
  }

  async createBlacklistedPassenger(blacklistpassenger) {
    const query = `mutation blacklistAdd($blacklistpassenger: PassengerInputs!) {
                blacklistAdd(blacklistpassenger: $passenger) {
                  id
                }
              }`;
    const data = await graphQLFetch(query, {
      blacklistpassenger
    });

    if (data) {
      this.loadData2();
    }
  }
  /*Edit ends here */


  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", null, "Welcome To Singapore Railway"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("h1", null, "Reservation List"), /*#__PURE__*/React.createElement(ReservationListTable, {
      passengers: this.state.passengers
    }), /*#__PURE__*/React.createElement(PassengerAdd, {
      createPassenger: this.createPassenger
    }), /*#__PURE__*/React.createElement(PassengerDelete, {
      deletePassenger: this.deletePassenger
    }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("h1", null, "Blacklist"), /*#__PURE__*/React.createElement(BlackListTable, {
      blacklistedpassengers: this.state.blacklistedpassengers
    }), /*#__PURE__*/React.createElement(BlacklistedPassengerAdd, {
      createBlacklistedPassenger: this.createBlacklistedPassenger
    }));
  }

}

const element = /*#__PURE__*/React.createElement(IssueList, null);
ReactDOM.render(element, document.getElementById('contents'));
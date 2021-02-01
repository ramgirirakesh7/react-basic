import React, { Component } from "react";
import { getPatients } from "../services";
import * as all from '../assets/questionnaire.json';
class Practitioner extends Component {
  constructor(props){
    super(props)
    this.state = {
      practitioners: [],
      searchInput: "",
      data : [], 
      error: false,
      date: ""
      
    }
  }

  // state = {
  //   practitioners: [],
  //   searchInput: "",
  //   data : [...this.state.practitioners]
    
  // };

  componentDidMount() {
    console.log(all)
    getPatients().then((res) => {
      this.setState({ practitioners: this.flattenPractitionerObj(res),
      data: this.flattenPractitionerObj(res)
      });
    });
    this.onSort.bind(this);
  }

  flattenPractitionerObj = (response) => {
    return (response.data.entry || []).map((item) => {
      console.log(item.resource)
      const name = item.resource.name || [];
      return {
        id: item.resource.id,
        name: `${((name[0] || {}).given || []).join(" ")} ${
          (name[0] || {}).family ? (name[0] || {}).family : ''
        }`,
        gender: item.resource.gender,
        dob: item.resource.birthDate,
        photo:
          "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
      };
    });
  };
  onSort(event){
    const data = this.state.practitioners;
    data.sort((a,b) => a['dob'].localeCompare(b['dob']))
    this.setState({practitioners : data})
  }
  globalSearch = () => {
    let { searchInput,practitioners , data} = this.state;
    let filteredData = data.filter(value => {
      return (
        value.id.toLowerCase().includes(searchInput.toLowerCase()) ||
        value.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        value.gender
          .toString()
          .toLowerCase()
          .includes(searchInput.toLowerCase()) 
      );
    });
    this.setState({ practitioners: filteredData });
  };
  handleChange = event => {
    if(event.target.name === 'searchInput'){
      if (/[^0-9a-zA-Z]/.test(event.target.value)) {
        // It has an invalid character
        this.setState({
          searchInput: event.target.value,
          error: true
        })
      }else{
        this.setState({ searchInput: event.target.value, error: false }, () => {
          this.globalSearch();
        });
      }
    }
    if(event.target.name === 'dateInput'){
      if (/[^0-9a-zA-Z]/.test(event.target.value)) {
        // It has an invalid character
        this.setState({
          date: event.target.value,
          error: true
        })
      }else{
        this.setState({ date: event.target.value, error: false }, () => {
          this.globalSearch();
        });
      }
    }
    
    
  };
  render() {
    const { practitioners, searchInput, error, date } = this.state;
    return (
      <div className="patient-details">
        <p>
        <input
          type="text"
          name="searchInput"
          placeholder="Search for full name or gender"
          value={searchInput || ""}
          onChange={this.handleChange}
        />
        <input type='date'
          value={date || ""}
          name = "dateInput"
          className='align-date'
          onChange={this.handleChange}
        />
        </p>
      {error && <div className='error'>Your search has invalid character</div>}
      <table>
        <thead>
          <tr>
            <th>Profile Image</th>
            <th>Full Name</th>
            <th>Gender</th>
            <th>Date of Birth</th>
          </tr>
        </thead>
        <tbody>
          {practitioners.map((practitioner) => (
            <tr key={practitioner.id}>
              <td>
                <img
                  src={practitioner.photo}
                  alt="Avatar"
                  style={{ height: 50, width: 50, borderRadius: "50%" }}
                />
              </td>
              <td>{practitioner.name}</td>
              <td>{practitioner.gender}</td>
              <td>{practitioner.dob}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    );
  }
}

export default Practitioner;

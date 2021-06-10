import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import StatesForm from "./StatesForm";
import { confirmValidCity } from "../utility/FormFieldUtilities";

interface EditRunModalProps {
  handleEditModalClose(): void,
  showEditModal: boolean,
  runBeingEdited: any,
  userData: any,
};

interface EditRunModalState {
  distance?: any,
  date?: string,
  city?: string,
  state?: string,
  notes?: string,
  runBeingEdited?: any,

  formError?: string
}

class EditRunModal extends Component<EditRunModalProps, EditRunModalState> {
  constructor(props: EditRunModalProps) {
    super(props);
    this.state = {
      distance: "",
      date: "",
      city: "",
      state: "",
      notes: "",
      runBeingEdited: {},

      formError: ""
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static getDerivedStateFromProps(props: any, state: any) {
    if (props.runBeingEdited && props.runBeingEdited !== state.runBeingEdited) {
      return {
        distance: props.runBeingEdited.distance,
        date: props.runBeingEdited.date,
        city: props.runBeingEdited.run_city,
        state: props.runBeingEdited.run_state,
        notes: props.runBeingEdited.notes,
        runBeingEdited: props.runBeingEdited
      }
    }
    return null;
  }

  handleChange(event: any) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({ [name]: value });
  }

  handleSubmit(event: any) {
    event.preventDefault();

    // Prevent sending response if run is invalid
    if (this.state.distance === "" || this.state.distance <= 0) {
      event.preventDefault();
      this.setState({
        formError: "Please enter a valid distance for the run!",
      });
      return;
    }

    // Make sure the user entered a valid city
    if (
      !confirmValidCity(this.state.city as string, this.state.state as string)
    ) {
      this.setState({
        formError: "City not found",
      });
      return;
    }

    // Create json object to send in POST request
    const runData = {
      user_id: this.props.userData.user_id,
      distance: this.state.distance,
      date: this.state.date,
      run_city: this.state.city,
      run_state: this.state.state,
      notes: this.state.notes,
    };

    console.log(runData);
    
    this.props.handleEditModalClose();
  }

  render() {
    return (
      <Modal
        show={this.props.showEditModal}
        onHide={this.props.handleEditModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Run</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={this.handleSubmit}>
            <input
              type="number"
              name="distance"
              value={this.state.distance}
              onChange={this.handleChange}
              placeholder="Distance"
              className="form_spacing form-control"
            />
            <input
              type="date"
              name="date"
              value={this.state.date}
              onChange={this.handleChange}
              placeholder="Date (MM/DD/YYYY)"
              className="form_spacing form-control"
            />
            <input
              type="text"
              name="city"
              value={this.state.city}
              onChange={this.handleChange}
              placeholder="City"
              className="form_spacing form-control"
            />
            <select
              name="state"
              value={this.state.state}
              onChange={this.handleChange}
              className="form_spacing form-control"
            >
              <StatesForm />
            </select>
            <textarea
              name="notes"
              value={this.state.notes}
              onChange={this.handleChange}
              placeholder="Notes"
              className="form_spacing form-control"
            />
            <p className="warning_text">{this.state.formError}</p>
            <button
              type="submit"
              className="form-control btn btn-success form_spacing"
            >
              Submit
            </button>
          </form>
        </Modal.Body>
      </Modal>
    );
  }
}

export default EditRunModal;

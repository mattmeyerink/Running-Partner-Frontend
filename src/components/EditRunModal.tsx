import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import StatesForm from "./StatesForm";

interface EditRunModalProps {
  handleEditModalClose(): void,
  showEditModal: boolean
};

interface EditRunModalState {
  distance?: string,
  date?: string,
  city?: string,
  state?: string,
  notes?: string,

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

      formError: ""
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: any) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({ [name]: value });
  }

  handleSubmit(event: any) {
    console.log("Yeet that bad boy in!!!");
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
        <Modal.Footer>
          <Button>Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EditRunModal;

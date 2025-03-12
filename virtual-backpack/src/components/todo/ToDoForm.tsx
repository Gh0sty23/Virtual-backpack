import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ToDoForm({addTodo}) {
  //Open Close
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
  //Validation
    const [validated, setValidated] = useState(false);
  
  //Functionality
    const [name, setName] = useState("");
    const [priority, setPriority] = useState("");
    const [date, setDate] = useState("");
    const handleSubmit = (e: { currentTarget: any; preventDefault: () => void; stopPropagation: () => void; }) => {
      const form = e.currentTarget;
      e.preventDefault();

      if (form.checkValidity() === true) {
        addTodo(name, priority, date);
        setName("");
        setPriority("Low");
        setDate("");
        // setShow(false);
      }

      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    }
  
    return (
      <>
      <div className="d-grid gap-2 col-6 mx-auto">
        <Button className = 'btn btn-dark' onClick={handleShow}>
          Add Task
        </Button>
      </div>
        
  
        <Modal show={show} onHide={handleClose} data-bs-theme="dark" centered>
          <Modal.Header closeButton>
            <Modal.Title className='text-dark'>Add New Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={validated}>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label className='text-dark'>Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="New Task"
                  autoFocus
                  className= 'to-do-input bg-light text-secondary'
                  value = {name}
                  onChange= {(e) => setName(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">Task Name is Required</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                <Form.Label className='text-dark'>Priority</Form.Label>
                <Form.Select className = "bg-light text-secondary" required value = {priority} aria-label="Default select example" onChange={(e) => setPriority(e.target.value)}>
                  <option className = "text-secondary" value="Low">Low</option>
                  <option className = "text-secondary" value="Medium">Medium</option>
                  <option className = "text-secondary" value="High">High</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                <Form.Label className='text-dark'>Date</Form.Label>
                <Form.Control
                  type="date"
                  autoFocus
                  value = {date}
                  className = 'bg-light text-secondary'
                  onChange= {(e) => setDate(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">Due Date is Required</Form.Control.Feedback>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Add Task
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}

export default ToDoForm;
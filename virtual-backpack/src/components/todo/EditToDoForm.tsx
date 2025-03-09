import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function EditToDoForm({editTask, task, show, handleClose}) {
  //Open Close
  
  //Validation
    const [validated, setValidated] = useState(false);
  
  //Functionality
    const [name, setName] = useState("");
    const [priority, setPriority] = useState("");
    const [date, setDate] = useState("");
    const handleSubmit = (e) => {
      const form = e.currentTarget;
      e.preventDefault();

      if (form.checkValidity() === true) {
        editTask(name, priority, date, task.id);
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
        <button className = "bg-transparent btn-outline-primary" onClick= {() => editTodo(task.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                    </svg>
        </button> 

        <Modal show={show} onHide={handleClose} data-bs-theme="dark" centered>
          <Modal.Header closeButton>
            <Modal.Title className='text-light'>Edit Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={validated}>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label className='text-light'>Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="New Task"
                  autoFocus
                  className= 'to-do-input'
                  value = {name}
                  onChange= {(e) => setName(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">Task Name is Required</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                <Form.Label className='text-light'>Priority</Form.Label>
                <Form.Select required value = {priority} aria-label="Default select example" onChange={(e) => setPriority(e.target.value)}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                <Form.Label className='text-light'>Date</Form.Label>
                <Form.Control
                  type="date"
                  autoFocus
                  value = {date}
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
              Update Task
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}

export default EditToDoForm;
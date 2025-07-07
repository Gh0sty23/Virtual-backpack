import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function EditToDoForm({ editTask, task, show, handleClose }: any) {
  const [validated, setValidated] = useState(false);
  const [name, setName] = useState(task.taskName || "");
  const [priority, setPriority] = useState(task.taskPriority || "Low");
  const [date, setDate] = useState(task.taskDate || "");
  const [dateError, setDateError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    e.preventDefault();

    const today = new Date();
    const enteredDate = new Date(date);

    if (form.checkValidity() === true) {
      // Normalize to compare only dates (create new Date objects to avoid mutation)
      const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const enteredDateNormalized = new Date(enteredDate.getFullYear(), enteredDate.getMonth(), enteredDate.getDate());

      if (enteredDateNormalized < todayNormalized) {
        setDateError("Due date cannot be in the past.");
        setValidated(true);
        return;
      }

      // Date is valid
      setDateError("");
      editTask(name, priority, date, task.id);
      setValidated(false);
      handleClose();
    } else {
      e.stopPropagation();
      setValidated(true);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} data-bs-theme="dark" centered>
        <Modal.Header closeButton>
          <Modal.Title className='text-light'>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label className='text-light'>Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Task Name"
                autoFocus
                className='to-do-input'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">Task Name is Required</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label className='text-light'>Priority</Form.Label>
              <Form.Select
                required
                value={priority}
                aria-label="Select priority"
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Label className='text-light'>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                isInvalid={validated && dateError !== ""}
              />
              <Form.Control.Feedback type="invalid">
                {dateError || "Due Date is Required"}
              </Form.Control.Feedback>
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Update Task
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditToDoForm;
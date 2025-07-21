import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface ToDoFormProps {
  addTodo: (name: string, priority: string, date: string) => void;
}

function ToDoForm({ addTodo }: ToDoFormProps) {
  // Modal open/close state
  const [show, setShow] = useState(false);
  const [dateError, setDateError] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setValidated(false);       // Reset validation state when opening modal
    setName("");               // Optional: reset fields when opening
    setPriority("Low");
    setDate("");
    setShow(true);
  };

  // Validation state
  const [validated, setValidated] = useState(false);

  // Controlled form fields
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("Low");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    const today = new Date();
    const selectedDate = new Date(date);
    const cleanedName = name.trim();
    if (cleanedName === "") {
      alert!("Name cannot be empty!");
      return;
    }
    setDateError(""); // Reset date error on submit
    if (form.checkValidity() === true && selectedDate >= today) {
      // Form is valid: add task, reset fields, close modal
      addTodo(name, priority, date);
      setName("");
      setPriority("Low");
      setDate("");
      setShow(false);
    } else {
      if (selectedDate < today) {
        setDateError("Due date cannot be in the past");
      }
    }

    // Always show validation feedback
    setValidated(true);
  };

  return (
    <>
      <div className="d-grid gap-2 col-6 mx-auto">
        <Button className="btn btn-dark" onClick={handleShow}>
          Add Task
        </Button>
      </div>

      <Modal show={show} onHide={handleClose} data-bs-theme="dark" centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-dark">Add New Task</Modal.Title>
        </Modal.Header>

        {/* Form wraps Modal.Body + Modal.Footer so submit works properly */}
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formTaskName">
              <Form.Label className="text-dark">Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="New Task"
                autoFocus
                className="to-do-input bg-light text-secondary"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Task Name is Required
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPriority">
              <Form.Label className="text-dark">Priority</Form.Label>
              <Form.Select
                className="bg-light text-secondary"
                required
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                aria-label="Priority select"
              >
                <option className="text-secondary" value="Low">Low</option>
                <option className="text-secondary" value="Medium">Medium</option>
                <option className="text-secondary" value="High">High</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDueDate">
              <Form.Label className="text-dark">Date</Form.Label>
              <Form.Control
                type="date"
                required
                className="bg-light text-secondary"
                min={new Date().toISOString().split("T")[0]} // Prevent past dates
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {dateError || "Due Date is Required"}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Add Task
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default ToDoForm;

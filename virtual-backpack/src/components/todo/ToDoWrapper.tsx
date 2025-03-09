import { Card } from "react-bootstrap";
import ToDo from "./ToDo";
import EditToDoForm from "./EditToDoForm";
import { useEffect, useState } from "react";
import React from "react";

function ToDoWrapper ({todos, head, toggleComplete, deleteTodo, editTodo}) {
    var newToDo = [];

    function isDueToday(value) {
        const newTaskDate = new Date(value.taskDate);
        newTaskDate.setHours(0,0,0,0);
        // console.log(newTaskDate);
        // console.log(new Date(new Date().toDateString()));
        
        if ((newTaskDate.toDateString() == new Date(new Date().toDateString()).toDateString())) {
            return value;
        }
    }

    function isUpcoming(value) {
        const newTaskDate = new Date(value.taskDate);
        newTaskDate.setHours(0,0,0,0);
        if ((newTaskDate > new Date(new Date().toDateString())) && (value.completed === false)) {
            // console.log(new Date(new Date().toDateString()));
            return value;
        }
    }

    function isMissed(value) {
        const newTaskDate = new Date(value.taskDate);
        newTaskDate.setHours(0,0,0,0);
        if ((newTaskDate < new Date(new Date().toDateString())) && (value.completed === false)) {
            return value;
        }
    }
    
    if (head === "Today") {
        newToDo = todos.filter(isDueToday);
    } else if (head === "Upcoming") {
        newToDo = todos.filter(isUpcoming);
    } else if (head === "Missed") {
        newToDo = todos.filter(isMissed);
    }
    

    const highPriority = newToDo.filter(value => value.taskPriority.includes("High"));
    const mediumPriority = newToDo.filter(value => value.taskPriority.includes("Medium"));
    const lowPriority = newToDo.filter(value => value.taskPriority.includes("Low"));
  

    return(
        <Card className = "bg-dark-subtle overflow-auto min-vh-75" style={{ width: '27vw', height: '85vh' }}>
            <Card.Body>
            <Card.Title className="text-dark fs-2 py-2">{head}</Card.Title>
            <Card.Subtitle className="mb-2 text-dark">High Priority</Card.Subtitle>
            <div>
                {highPriority.map((todo, index) => (
                    <ToDo task={todo} key={index} toggleComplete = {toggleComplete} deleteTodo = {deleteTodo} editTodo = {editTodo}/>
                ))}
            </div>
            <Card.Subtitle className="mb-2 text-dark">Medium Priority</Card.Subtitle>
            <div>
                {mediumPriority.map((todo, index) => (
                    <ToDo task={todo} key={index} toggleComplete = {toggleComplete} deleteTodo = {deleteTodo} editTodo = {editTodo}/>
                ))}
            </div>
            <Card.Subtitle className="mb-2 text-dark">Low Priority</Card.Subtitle>
            <div>
                {lowPriority.map((todo, index) => (
                    <ToDo task={todo} key={index} toggleComplete = {toggleComplete} deleteTodo = {deleteTodo} editTodo = {editTodo}/>
                ))}
            </div>
            <div>
            </div>
            </Card.Body>
        </Card>
    ) 
}

export default ToDoWrapper;
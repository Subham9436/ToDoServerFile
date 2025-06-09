const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;
app.use(express.json());

const todosFilePath = path.join(todos.txt, "todos.json");

// Load todos from file if it exists
let todos = [];
if (fs.existsSync(todosFilePath)) {
  const data = fs.readFileSync(todosFilePath);
  todos = JSON.parse(data);
}

// Save todos to file
const saveTodosToFile = () => {
  fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
};

// 1. GET /todos - Retrieve all todo items
app.get("/todos", (req, res) => {
  res.status(200).json(todos);
});

// 2. GET /todos/:id - Retrieve a specific todo item by ID
app.get("/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const todoItem = todos.find((todo) => todo.id === todoId);
  if (!todoItem) {
    return res.status(404).json({ error: "Todo not found" });
  }
  res.status(200).json(todoItem);
});

// 3. POST /todos - Create a new todo item
app.post("/todos", (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  const newTodo = {
    id: todos.length > 0 ? Math.max(todos.map(todo => todo.id)) + 1 : 1,
    title,
    description,
    completed: false,
  };

  todos.push(newTodo);
  saveTodosToFile(); // Save to file after adding
  res.status(201).json({ id: newTodo.id });
});

// 4. PUT /todos/:id - Update an existing todo item by ID
app.put("/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const { title, description, completed } = req.body;

  const todoItem = todos.find((todo) => todo.id === todoId);
  if (!todoItem) {
    return res.status(404).json({ error: "Todo not found" });
  }

  if (title) todoItem.title = title;
  if (description) todoItem.description = description;
  if (completed !== undefined) todoItem.completed = completed;

  saveTodosToFile(); // Save to file after updating
  res.status(200).json({ message: "Todo updated successfully" });
});

// 5. DELETE /todos/:id - Delete a todo item by ID
app.delete("/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const todoIndex = todos.findIndex((todo) => todo.id === todoId);
  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todos.splice(todoIndex, 1);
  saveTodosToFile(); // Save to file after deleting
  res.status(200).json({ message: "Todo deleted successfully" });
});

// Handle 404 for any other routes
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

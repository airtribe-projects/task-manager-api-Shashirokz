const tap = require("tap");
const supertest = require("supertest");
const app = require("../app");
const server = supertest(app);

let serverInstance

tap.beforeEach(async () => {
  serverInstance = app.listen(3001, () => {
    console.log('Test server started');
  });
});

tap.afterEach(async () => {
  if (serverInstance) {
    await new Promise(resolve => serverInstance.close(resolve));
    console.log('Test server stopped');
  }
});

tap.test("POST /api/tasks", async (t) => {
  const newTask = {
    taskName: "New Task",
    description: "New Task Description",
    startDate: "2025-01-01T08:00:00.000Z",
    endDate: "2025-01-10T17:00:00.000Z",
    priority: "High",
    status: "Pending"
  };
  const response = await server.post("/api/tasks").send(newTask);
  t.equal(response.status, 200);
  t.hasOwnProp(response.body, "id");
  t.equal(response.body.taskName, newTask.taskName);
  t.equal(response.body.description, newTask.description);
  t.equal(response.body.startDate, newTask.startDate);
  t.equal(response.body.endDate, newTask.endDate);
  t.equal(response.body.priority, newTask.priority);
  t.equal(response.body.status, newTask.status);
  t.end();
});

tap.test("POST /api/tasks with invalid data", async (t) => {
  const newTask = {
    taskName: "New Task"
  };
  const response = await server.post("/api/tasks").send(newTask);
  t.equal(response.status, 400);
  t.equal(response.body.message, "Missing required task fields");
  t.end();
});

tap.test("GET /api/tasks", async (t) => {
  const response = await server.get("/api/tasks");
  t.equal(response.status, 200);
  t.type(response.body, "object");
  t.ok(Array.isArray(response.body), "Response body should be an array of tasks");
  t.hasOwnProp(response.body[0], "id");
  t.hasOwnProp(response.body[0], "taskName");
  t.hasOwnProp(response.body[0], "description");
  t.hasOwnProp(response.body[0], "startDate");
  t.hasOwnProp(response.body[0], "endDate");
  t.hasOwnProp(response.body[0], "priority");
  t.hasOwnProp(response.body[0], "status");
  t.type(response.body[0].id, "number");
  t.type(response.body[0].taskName, "string");
  t.type(response.body[0].description, "string");
  t.type(response.body[0].startDate, "string");
  t.type(response.body[0].endDate, "string");
  t.type(response.body[0].priority, "string");
  t.type(response.body[0].status, "string");
  t.end();
});

tap.test("GET /api/tasks/:id", async (t) => {
  const response = await server.get("/api/tasks/1");
  t.equal(response.status, 200);
  t.hasOwnProp(response.body, "id");
  t.hasOwnProp(response.body, "taskName");
  t.hasOwnProp(response.body, "description");
  t.hasOwnProp(response.body, "startDate");
  t.hasOwnProp(response.body, "endDate");
  t.hasOwnProp(response.body, "priority");
  t.hasOwnProp(response.body, "status");
  t.end();
});

tap.test("GET /api/tasks/:id with invalid id", async (t) => {
  const response = await server.get("/api/tasks/999");
  t.equal(response.status, 404);
  t.equal(response.body.message, "No task found, please create a task");
  t.end();
});

tap.test("PUT /api/tasks/:id", async (t) => {
  const updatedTask = {
    taskName: "Updated Task",
    description: "Updated Task Description",
    startDate: "2025-01-01T08:00:00.000Z",
    endDate: "2025-01-10T17:00:00.000Z",
    priority: "Medium",
    status: "In Progress"
  };
  const response = await server.put("/api/tasks/1").send(updatedTask);
  t.equal(response.status, 200);
  t.equal(response.body.taskName, updatedTask.taskName);
  t.equal(response.body.description, updatedTask.description);
  t.equal(response.body.startDate, updatedTask.startDate);
  t.equal(response.body.endDate, updatedTask.endDate);
  t.equal(response.body.priority, updatedTask.priority);
  t.equal(response.body.status, updatedTask.status);
  t.end();
});

tap.test("PUT /api/tasks/:id with invalid id", async (t) => {
  const updatedTask = {
    taskName: "Updated Task",
    description: "Updated Task Description",
    startDate: "2025-01-01T08:00:00.000Z",
    endDate: "2025-01-10T17:00:00.000Z",
    priority: "Medium",
    status: "In Progress"
  };
  const response = await server.put("/api/tasks/999").send(updatedTask);
  t.equal(response.status, 404);
  t.equal(response.body.message, "Task not found");
  t.end();
});

tap.test("PUT /api/tasks/:id with invalid data", async (t) => {
  const updatedTask = {
    taskName: "Updated Task",
    description: "Updated Task Description",
    startDate: "2025-01-01T08:00:00.000Z",
    endDate: "2025-01-10T17:00:00.000Z",
    priority: "Medium",
    status: ""
  };
  const response = await server.put("/api/tasks/1").send(updatedTask);
  t.equal(response.status, 400);
  t.equal(response.body.message, "Missing required task fields");
  t.end();
});

tap.test("DELETE /api/tasks/:id", async (t) => {
  const response = await server.delete("/api/tasks/1");
  t.equal(response.status, 200);
  t.equal(response.body.message, "Task deleted successfully");
  t.end();
});

tap.test("DELETE /api/tasks/:id with invalid id", async (t) => {
  const response = await server.delete("/api/tasks/999");
  t.equal(response.status, 404);
  t.equal(response.body.message, "Task not found");
  t.end();
});

tap.teardown(() => {
  process.exit(0);
});

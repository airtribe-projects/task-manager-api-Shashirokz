const express = require('express')
const router = express.Router()

const generateId = require('../utils/utils.js')

const tasks = [
	{
		id: 1,
		taskName: 'Task 1',
		description: 'This is the first task description',
		startDate: '2025-01-01T08:00:00.000Z',
		endDate: '2025-01-10T17:00:00.000Z',
		priority: 'High',
		status: 'Pending'
	},
	{
		id: 2,
		taskName: 'Task 2',
		description: 'This is the second task description',
		startDate: '2025-01-05T08:00:00.000Z',
		endDate: '2025-01-15T17:00:00.000Z',
		priority: 'Medium',
		status: 'In Progress'
	},
	{
		id: 3,
		taskName: 'Task 3',
		description: 'This is the third task description',
		startDate: '2025-01-10T08:00:00.000Z',
		endDate: '2025-01-20T17:00:00.000Z',
		priority: 'Low',
		status: 'Completed'
	},
	{
		id: 4,
		taskName: 'Task 4',
		description: 'This is the fourth task description',
		startDate: '2025-01-12T08:00:00.000Z',
		endDate: '2025-01-25T17:00:00.000Z',
		priority: 'High',
		status: 'Pending'
	},
	{
		id: 5,
		taskName: 'Task 5',
		description: 'This is the fifth task description',
		startDate: '2025-01-15T08:00:00.000Z',
		endDate: '2025-01-30T17:00:00.000Z',
		priority: 'Low',
		status: 'In Progress'
	}
]

router.get('/api/tasks',(req, res) => {
	res.send(tasks)
})

router.get('/api/tasks/:id',(req, res) => {
	const task = tasks.find(task => task.id === parseInt(req.params.id))
	if (!task) {
		return res.status(404).send({message: 'No task found, please create a task'})
	}
	res.send(task)
})

router.post('/api/tasks/',(req, res) => {
	const task = req.body
	const { taskName, description, startDate, endDate, priority, status } = req.body
	if (!taskName || !description || !startDate || !endDate || !priority || !status) {
		return res.status(400).send({ message: 'Missing required task fields' })
	}
	task.id = generateId()
	tasks.push(task)
	res.send(task)
})

router.put('/api/tasks/:id',(req, res) => {
	const task = tasks.find(task => task.id === parseInt(req.params.id))
	if (!task) {
		return res.status(404).send({ message: 'Task not found' })
	}
	const { taskName, description, startDate, endDate, priority, status } = req.body
	if (!taskName || !description || !startDate || !endDate || !priority || !status) {
		return res.status(400).send({ message: 'Missing required task fields' })
	}
	Object.assign(task, req.body)
	res.send(task)
})

router.patch('/api/tasks/:id',(req, res) => {
	const task = tasks.find(task => task.id === parseInt(req.params.id))
	if (!task) {
		return res.status(404).send({ message: 'Task not found' })
	}
	Object.assign(task, req.body)
	res.send(task)
})

router.delete('/api/tasks/:id', (req, res) => {
	const id = parseInt(req.params.id)

	if (!id) return res.status(400).send({ message: 'Task id is invalid.' })

	const task = tasks.find(task => task.id === id)
	if (!task) {
		return res.status(404).send({ message: 'Task not found' });
	}
	const index = tasks.indexOf(task)
	tasks.splice(index, 1)
	res.send({ message: 'Task deleted successfully'})
})

module.exports = router

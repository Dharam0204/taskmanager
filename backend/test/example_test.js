
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const Task = require('../models/Task');
const {
    getTasks,
    addTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController');

describe('Task Controller Unit Tests', function () {
    let sandbox;
    let req;
    let res;
    let userId;

    beforeEach(function () {
        sandbox = sinon.createSandbox();
        userId = new mongoose.Types.ObjectId();

        req = {
            user: { id: userId },
            params: { id: new mongoose.Types.ObjectId().toString() },
            body: {
                title: 'New Task',
                description: 'Task description',
                completed: false,
                deadline: '2026-12-31'
            }
        };

        res = {
            status: sandbox.stub().returnsThis(),
            json: sandbox.spy()
        };
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('getTasks', function () {
        it('should retrieve tasks successfully', async function () {
            const tasks = [{ title: 'Existing Task', userId }];
            const findStub = sandbox.stub(Task, 'find').resolves(tasks);

            await getTasks(req, res);

            expect(findStub.calledOnceWith({ userId })).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(tasks)).to.be.true;
        });

        it('should return 500 if retrieving tasks fails', async function () {
            sandbox.stub(Task, 'find').rejects(new Error('DB Error'));

            await getTasks(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
        });
    });

    describe('addTask', function () {
        it('should create a new task successfully', async function () {
            const createdTask = {
                _id: new mongoose.Types.ObjectId(),
                ...req.body,
                userId
            };

            const createStub = sandbox.stub(Task, 'create').resolves(createdTask);

            await addTask(req, res);

            expect(createStub.calledOnceWith({
                userId,
                ...req.body
            })).to.be.true;

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith(createdTask)).to.be.true;
        });

        it('should return 500 if task creation fails', async function () {
            sandbox.stub(Task, 'create').rejects(new Error('DB Error'));

            await addTask(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
        });
    });

    describe('updateTask', function () {
        it('should update an existing task successfully', async function () {
            const updatedTask = { ...req.body, userId };

            const task = {
                ...req.body,
                save: sandbox.stub().resolves(updatedTask)
            };

            const findStub = sandbox.stub(Task, 'findOne').resolves(task);

            await updateTask(req, res);

            expect(findStub.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(updatedTask)).to.be.true;
        });

        it('should return 404 if the task is not found', async function () {
            sandbox.stub(Task, 'findOne').resolves(null);

            await updateTask(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Task not found' })).to.be.true;
        });

        it('should return 500 if updating the task fails', async function () {
            sandbox.stub(Task, 'findOne').rejects(new Error('DB Error'));

            await updateTask(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
        });
    });

    describe('deleteTask', function () {
        it('should delete an existing task successfully', async function () {
            const deletedTask = { _id: req.params.id, title: 'Old Task' };

            const deleteStub = sandbox.stub(Task, 'findOneAndDelete')
                .resolves(deletedTask);

            await deleteTask(req, res);

            expect(deleteStub.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({
                message: 'Task deleted successfully'
            })).to.be.true;
        });

        it('should return 404 if the task to delete is not found', async function () {
            sandbox.stub(Task, 'findOneAndDelete').resolves(null);

            await deleteTask(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Task not found' })).to.be.true;
        });

        it('should return 500 if deleting the task fails', async function () {
            sandbox.stub(Task, 'findOneAndDelete').rejects(new Error('DB Error'));

            await deleteTask(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
        });
    });
});

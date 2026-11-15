
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const Task = require('../models/Task');

const {
    getTasks,
    getAvailableTasks,
    addTask,
    updateTask,
    deleteTask,
    acceptTask,
    completeTask
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
            user: { id: userId, role: 'helpSeeker' },
            params: { id: new mongoose.Types.ObjectId().toString() },
            body: {
                title: 'New Task',
                description: 'Task description',
                completed: false,
                deadline: '2026-12-31',
                category: 'Gardening'
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
        it('should retrieve Help Seeker requests successfully', async function () {
            const tasks = [{ title: 'Existing Task', userId }];
            const findStub = sandbox.stub(Task, 'find').resolves(tasks);

            await getTasks(req, res);

            expect(findStub.calledOnceWith({ userId })).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(tasks)).to.be.true;
        });

        it('should retrieve accepted requests for a Helper', async function () {
            req.user.role = 'helper';

            const tasks = [{ title: 'Accepted Request' }];
            const findStub = sandbox.stub(Task, 'find').resolves(tasks);

            await getTasks(req, res);

            expect(findStub.calledOnce).to.be.true;
            expect(findStub.firstCall.args[0]).to.deep.equal({
                acceptedBy: userId,
                status: { $in: ['accepted', 'completed'] }
            });
            expect(res.status.calledWith(200)).to.be.true;
        });

        it('should return 500 if retrieving tasks fails', async function () {
            sandbox.stub(Task, 'find').rejects(new Error('DB Error'));

            await getTasks(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
        });
    });

    describe('getAvailableTasks', function () {
        it('should allow Helpers to browse available requests', async function () {
            req.user.role = 'helper';

            const tasks = [{ title: 'Gardening Help' }];
            const populateStub = sandbox.stub().resolves(tasks);
            const findStub = sandbox.stub(Task, 'find').returns({
                populate: populateStub
            });

            await getAvailableTasks(req, res);

            expect(findStub.calledOnce).to.be.true;
            expect(populateStub.calledOnceWith('userId', 'name')).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(tasks)).to.be.true;
        });

        it('should prevent Help Seekers from browsing available requests', async function () {
            const findStub = sandbox.stub(Task, 'find');

            await getAvailableTasks(req, res);

            expect(findStub.notCalled).to.be.true;
            expect(res.status.calledWith(403)).to.be.true;
        });
    });

    describe('addTask', function () {
        it('should create a new request successfully', async function () {
            const createdTask = {
                _id: new mongoose.Types.ObjectId(),
                title: 'New Task',
                userId
            };

            const createStub = sandbox.stub(Task, 'create').resolves(createdTask);

            await addTask(req, res);

            expect(createStub.calledOnce).to.be.true;
            expect(createStub.firstCall.args[0]).to.include({
                userId,
                title: 'New Task',
                description: 'Task description',
                category: 'Gardening',
                status: 'available',
                acceptedBy: null,
                completed: false
            });

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith(createdTask)).to.be.true;
        });

        it('should prevent Helpers from creating requests', async function () {
            req.user.role = 'helper';

            const createStub = sandbox.stub(Task, 'create');

            await addTask(req, res);

            expect(createStub.notCalled).to.be.true;
            expect(res.status.calledWith(403)).to.be.true;
        });

        it('should reject a request without a title', async function () {
            req.body.title = '   ';

            const createStub = sandbox.stub(Task, 'create');

            await addTask(req, res);

            expect(createStub.notCalled).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
        });

        it('should return 500 if request creation fails', async function () {
            sandbox.stub(Task, 'create').rejects(new Error('DB Error'));

            await addTask(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
        });
    });

    describe('updateTask', function () {
        it('should update an existing request successfully', async function () {
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

        it('should return 404 if the request is not found', async function () {
            sandbox.stub(Task, 'findOne').resolves(null);

            await updateTask(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Task not found' })).to.be.true;
        });

        it('should return 500 if updating the request fails', async function () {
            sandbox.stub(Task, 'findOne').rejects(new Error('DB Error'));

            await updateTask(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
        });
    });

    describe('deleteTask', function () {
        it('should delete an existing request successfully', async function () {
            const task = {
                _id: req.params.id,
                title: 'Old Task',
                acceptedBy: null,
                status: 'available'
            };

            sandbox.stub(Task, 'findOne').resolves(task);

            const deleteStub = sandbox.stub(Task, 'findOneAndDelete')
                .resolves(task);

            await deleteTask(req, res);

            expect(deleteStub.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({
                message: 'Request deleted successfully'
            })).to.be.true;
        });

        it('should return 404 if the request to delete is not found', async function () {
            sandbox.stub(Task, 'findOne').resolves(null);

            await deleteTask(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });

        it('should return 500 if deleting the request fails', async function () {
            sandbox.stub(Task, 'findOne').rejects(new Error('DB Error'));

            await deleteTask(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
        });
    });

    describe('acceptTask', function () {
        it('should allow a Helper to accept an available request', async function () {
            req.user.role = 'helper';

            const acceptedTask = {
                title: 'Gardening Help',
                status: 'accepted',
                acceptedBy: userId
            };

            const updateStub = sandbox.stub(Task, 'findOneAndUpdate')
                .resolves(acceptedTask);

            await acceptTask(req, res);

            expect(updateStub.calledOnce).to.be.true;
            expect(updateStub.firstCall.args[1].$set).to.deep.equal({
                acceptedBy: userId,
                status: 'accepted',
                completed: false
            });
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(acceptedTask)).to.be.true;
        });

        it('should prevent Help Seekers from accepting requests', async function () {
            const updateStub = sandbox.stub(Task, 'findOneAndUpdate');

            await acceptTask(req, res);

            expect(updateStub.notCalled).to.be.true;
            expect(res.status.calledWith(403)).to.be.true;
        });

        it('should return 404 if a request is unavailable', async function () {
            req.user.role = 'helper';

            sandbox.stub(Task, 'findOneAndUpdate').resolves(null);

            await acceptTask(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });
    });

    describe('completeTask', function () {
        it('should allow a Helper to complete an accepted request', async function () {
            req.user.role = 'helper';

            const completedTask = {
                title: 'Gardening Help',
                status: 'completed',
                completed: true
            };

            const updateStub = sandbox.stub(Task, 'findOneAndUpdate')
                .resolves(completedTask);

            await completeTask(req, res);

            expect(updateStub.calledOnce).to.be.true;
            expect(updateStub.firstCall.args[1].$set).to.deep.equal({
                status: 'completed',
                completed: true
            });
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(completedTask)).to.be.true;
        });

        it('should prevent Help Seekers from completing requests', async function () {
            const updateStub = sandbox.stub(Task, 'findOneAndUpdate');

            await completeTask(req, res);

            expect(updateStub.notCalled).to.be.true;
            expect(res.status.calledWith(403)).to.be.true;
        });

        it('should return 404 if the accepted request is not found', async function () {
            req.user.role = 'helper';

            sandbox.stub(Task, 'findOneAndUpdate').resolves(null);

            await completeTask(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });
    });
});

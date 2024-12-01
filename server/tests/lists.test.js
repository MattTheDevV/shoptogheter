// Tests for List Routes and Edge Cases

const request = require('supertest');
const express = require('express');
const listRoutes = require('../routes/lists'); // Assuming the routes file is named lists.js

const app = express();
app.use(express.json());
app.use('/lists', listRoutes);

beforeEach(() => {
  // Reset the lists array before each test
  lists.length = 0;
});

describe('List Routes', () => {
  describe('POST /lists/addList', () => {
    it('should add a new list', async () => {
      const res = await request(app)
        .post('/lists/addList')
        .send({ currentUserId: 'user1', listName: 'Test List' });

      expect(res.status).toBe(200);
      expect(res.body.dtoOut).toHaveProperty('name', 'Test List');
      expect(res.body.dtoOut).toHaveProperty('owner', 'user1');
    });

    it('should return 400 if listName is missing', async () => {
      const res = await request(app)
        .post('/lists/addList')
        .send({ currentUserId: 'user1' });

      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /lists/setListName', () => {
    it('should update the list name', async () => {
      lists.push({ id: '1', name: 'Old Name', owner: 'user1', collaborators: [], items: [], archived: false });

      const res = await request(app)
        .patch('/lists/setListName')
        .send({ currentUserId: 'user1', listId: '1', newListName: 'New Name' });

      expect(res.status).toBe(200);
      expect(res.body.dtoOut).toHaveProperty('name', 'New Name');
    });

    it('should return 404 if list is not found', async () => {
      const res = await request(app)
        .patch('/lists/setListName')
        .send({ currentUserId: 'user1', listId: '2', newListName: 'New Name' });

      expect(res.status).toBe(404);
    });

    it('should return 403 if user is not the owner', async () => {
      lists.push({ id: '1', name: 'Old Name', owner: 'user1', collaborators: [], items: [], archived: false });

      const res = await request(app)
        .patch('/lists/setListName')
        .send({ currentUserId: 'user2', listId: '1', newListName: 'New Name' });

      expect(res.status).toBe(403);
    });
  });

  describe('PATCH /lists/setArchivedList', () => {
    it('should archive the list', async () => {
      lists.push({ id: '1', name: 'Test List', owner: 'user1', collaborators: [], items: [], archived: false });

      const res = await request(app)
        .patch('/lists/setArchivedList')
        .send({ currentUserId: 'user1', listId: '1', archived: true });

      expect(res.status).toBe(200);
      expect(res.body.dtoOut).toHaveProperty('archived', true);
    });

    it('should return 403 if user is not the owner', async () => {
      lists.push({ id: '1', name: 'Test List', owner: 'user1', collaborators: [], items: [], archived: false });

      const res = await request(app)
        .patch('/lists/setArchivedList')
        .send({ currentUserId: 'user2', listId: '1', archived: true });

      expect(res.status).toBe(403);
    });
  });

  describe('POST /lists/addItemToList', () => {
    it('should add an item to the list', async () => {
      lists.push({ id: '1', name: 'Test List', owner: 'user1', collaborators: [], items: [], archived: false });

      const res = await request(app)
        .post('/lists/addItemToList')
        .send({ currentUserId: 'user1', listId: '1', itemName: 'Test Item' });

      expect(res.status).toBe(200);
      expect(res.body.dtoOut).toHaveProperty('name', 'Test Item');
    });

    it('should return 403 if user is not the owner or collaborator', async () => {
      lists.push({ id: '1', name: 'Test List', owner: 'user1', collaborators: [], items: [], archived: false });

      const res = await request(app)
        .post('/lists/addItemToList')
        .send({ currentUserId: 'user2', listId: '1', itemName: 'Test Item' });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /lists/removeItemFromList', () => {
    it('should remove an item from the list', async () => {
      lists.push({
        id: '1',
        name: 'Test List',
        owner: 'user1',
        collaborators: [],
        items: [{ id: 'item1', name: 'Test Item', done: false }],
        archived: false,
      });

      const res = await request(app)
        .delete('/lists/removeItemFromList')
        .send({ currentUserId: 'user1', listId: '1', itemId: 'item1' });

      expect(res.status).toBe(200);
      expect(res.body.dtoOut).toHaveProperty('id', 'item1');
      expect(res.body.dtoOut).toHaveProperty('success', true);
    });

    it('should return 403 if user is not the owner or collaborator', async () => {
      lists.push({
        id: '1',
        name: 'Test List',
        owner: 'user1',
        collaborators: [],
        items: [{ id: 'item1', name: 'Test Item', done: false }],
        archived: false,
      });

      const res = await request(app)
        .delete('/lists/removeItemFromList')
        .send({ currentUserId: 'user2', listId: '1', itemId: 'item1' });

      expect(res.status).toBe(403);
    });
  });

  describe('PATCH /lists/setMarkedItem', () => {
    it('should mark an item as done', async () => {
      lists.push({
        id: '1',
        name: 'Test List',
        owner: 'user1',
        collaborators: [],
        items: [{ id: 'item1', name: 'Test Item', done: false }],
        archived: false,
      });

      const res = await request(app)
        .patch('/lists/setMarkedItem')
        .send({ currentUserId: 'user1', listId: '1', itemId: 'item1', isMarked: true });

      expect(res.status).toBe(200);
      expect(res.body.dtoOut).toHaveProperty('done', true);
    });

    it('should return 403 if user is not the owner or collaborator', async () => {
      lists.push({
        id: '1',
        name: 'Test List',
        owner: 'user1',
        collaborators: [],
        items: [{ id: 'item1', name: 'Test Item', done: false }],
        archived: false,
      });

      const res = await request(app)
        .patch('/lists/setMarkedItem')
        .send({ currentUserId: 'user2', listId: '1', itemId: 'item1', isMarked: true });

      expect(res.status).toBe(403);
    });
  });

  describe('POST /lists/addCollaborator', () => {
    it('should add a collaborator to the list', async () => {
      lists.push({ id: '1', name: 'Test List', owner: 'user1', collaborators: [], items: [], archived: false });

      const res = await request(app)
        .post('/lists/addCollaborator')
        .send({ currentUserId: 'user1', listId: '1', invitedCollaboratorId: 'user2' });

      expect(res.status).toBe(200);
      expect(res.body.dtoOut.collaborators).toContain('user2');
    });

    it('should return 403 if user is not the owner', async () => {
      lists.push({ id: '1', name: 'Test List', owner: 'user1', collaborators: [], items: [], archived: false });

      const res = await request(app)
        .post('/lists/addCollaborator')
        .send({ currentUserId: 'user2', listId: '1', invitedCollaboratorId: 'user3' });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /lists/removeCollaborator', () => {
    it('should remove a collaborator from the list', async () => {
      lists.push({ id: '1', name: 'Test List', owner: 'user1', collaborators: ['user2'], items: [], archived: false });

      const res = await request(app)
        .delete('/lists/removeCollaborator')
        .send({ currentUserId: 'user1', listId: '1', removeCollaboratorId: 'user2' });

      expect(res.status).toBe(200);
      expect(res.body.dtoOut.collaborators).not.toContain('user2');
    });

    it('should return 403 if user is not the owner', async () => {
      lists.push({ id: '1', name: 'Test List', owner: 'user1', collaborators: ['user2'], items: [], archived: false });

      const res = await request(app)
        .delete('/lists/removeCollaborator')
        .send({ currentUserId: 'user2', listId: '1', removeCollaboratorId: 'user2' });

      expect(res.status).toBe(403);
    });
  });
});

import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (_, res) => {
      const tasks = database.select('tasks');

      return res.writeHead(200).end(JSON.stringify(tasks));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      const now = new Date().toISOString();

      const task = {
        title,
        description,
        created_at: now,
        updated_at: now,
        completed_at: null,
      };

      const createdTask = database.insert('tasks', task);

      return res.writeHead(201).end(JSON.stringify(createdTask));
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const [task] = database.select('tasks', {
        id,
      });

      const now = new Date().toISOString();

      const updatedTask = {
        ...task,
        title,
        description,
        updated_at: now,
      };

      database.update('tasks', id, updatedTask);

      return res.writeHead(204).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete('tasks', id);

      return res.writeHead(204).end();
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;

      const [task] = database.select('tasks', {
        id,
      });

      const now = new Date().toISOString();

      const completedTask = {
        ...task,
        completed_at: now,
        updated_at: now,
      };

      database.update('tasks', id, completedTask);

      return res.writeHead(204).end();
    },
  },
];

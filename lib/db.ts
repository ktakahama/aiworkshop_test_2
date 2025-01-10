import { sql } from '@vercel/postgres';

export async function createTasksTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        goal TEXT NOT NULL,
        task TEXT NOT NULL,
        priority TEXT NOT NULL,
        details TEXT,
        completed BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Tasks table created successfully');
  } catch (error) {
    console.error('Error creating tasks table:', error);
    throw error;
  }
}

export async function getTasks() {
  try {
    const { rows } = await sql`SELECT * FROM tasks ORDER BY created_at DESC;`;
    return rows;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

export async function createTask(goal: string, task: string, priority: string, details: string) {
  try {
    const { rows } = await sql`
      INSERT INTO tasks (goal, task, priority, details)
      VALUES (${goal}, ${task}, ${priority}, ${details})
      RETURNING *;
    `;
    return rows[0];
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

export async function updateTaskStatus(id: number, completed: boolean) {
  try {
    const { rows } = await sql`
      UPDATE tasks
      SET completed = ${completed}
      WHERE id = ${id}
      RETURNING *;
    `;
    return rows[0];
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
}

export async function deleteTask(id: number) {
  try {
    const { rows } = await sql`
      DELETE FROM tasks
      WHERE id = ${id}
      RETURNING *;
    `;
    return rows[0];
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

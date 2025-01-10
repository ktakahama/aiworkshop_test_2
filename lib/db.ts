import { sql } from '@vercel/postgres';

export async function createTodosTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        task TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Todos table created successfully');
  } catch (error) {
    console.error('Error creating todos table:', error);
    throw error;
  }
}

export async function getTodos() {
  try {
    const { rows } = await sql`SELECT * FROM todos ORDER BY created_at DESC`;
    return rows;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
}

export async function addTodo(task: string) {
  try {
    const { rows } = await sql`
      INSERT INTO todos (task)
      VALUES (${task})
      RETURNING *
    `;
    return rows[0];
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
}

export async function deleteTodo(id: number) {
  try {
    const { rows } = await sql`
      DELETE FROM todos
      WHERE id = ${id}
      RETURNING *
    `;
    return rows[0];
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
}

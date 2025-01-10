import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateTasks(goal: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "あなたは目的に応じたタスクリストを生成するアシスタントです。各タスクには優先順位（high/medium/low）と詳細な説明を含めてください。"
        },
        {
          role: "user",
          content: `以下の目的のための具体的なタスクリストを3-5個生成してください。以下の形式のJSONで返してください：
          {
            "tasks": [
              {
                "task": "タスク名",
                "priority": "優先順位(high/medium/low)",
                "details": "詳細な説明"
              }
            ]
          }
          
          目的：${goal}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0].message.content;
    if (!response) throw new Error('No response from OpenAI');

    const parsedResponse = JSON.parse(response);
    return parsedResponse.tasks.map((task: any) => ({
      ...task,
      goal,
    }));
  } catch (error) {
    console.error('Error generating tasks:', error);
    throw error;
  }
} 
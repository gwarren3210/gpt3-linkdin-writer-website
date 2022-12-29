import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const basePromptPrefix =
`
Generate 1 linkdin title from the idea below.

Idea:
`

const generateAction = async (req, res) => {
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.8,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  const secondPrompt = 
  `
  Take the idea and titles and generate a concise inspirational linkdin post in the style of Neil Patel and Gary Vaynerchuk. Make sure to include a personal anecdote and lessons learned from said story that relates to the title. The post should convey confidence and authenticity.


  Idea: ${req.body.userInput}

  Titles: ${basePromptOutput.text}

  LinkdIn Post:
  `

  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    temperature: 0.7,
    max_tokens: 200,
  });
  
  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();
  
  const thirdPrompt = 
  `
  Take the LinkdIn post below and generate 5 unordered trending hashtags related to the content in the post.

  LinkdIn post: ${secondPromptCompletion.text}
     
  Hashtags:`

  const thirdPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${thirdPrompt}`,
    temperature: 0.7,
    max_tokens: 200,
  });
  
  // Get the output
  const thirdPromptOutput = thirdPromptCompletion.data.choices.pop();

  const completedPrompt = `${secondPromptOutput.text}
     
  ${thirdPromptOutput.text}`
  // Send over the Prompt #2's output to our UI.
  res.status(200).json({ output: {text: completedPrompt} });
};

export default generateAction;
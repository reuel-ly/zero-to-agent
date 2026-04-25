import { Chat } from 'chat';
import { DiscordAdapter } from '@chat-adapter/discord'; 
import { MemoryStateAdapter } from '@chat-adapter/state-memory';

// Reply whenever the bot is @-mentioned 
bot.onNewMention(async (thread) => { const userMessage = thread.messages.at(-1).content; await thread.post(`You said: ${userMessage}`); });

// React to any message in subscribed channels 
bot.onSubscribedMessage(async (thread) => { await thread.post('👋 Got your message!'); }); 
// Respond to emoji reactions 
bot.onReaction(async (thread, reaction) => { await thread.post(`You reacted with ${reaction.emoji}!`); });


import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';

bot.onNewMention(async (thread) => {
  const history = thread.messages.map(m => ({
    role: m.fromBot ? 'assistant' : 'user',
    content: m.content,
  }));

  const stream = streamText({
    model: groq('openai/gpt-oss-20b'),
    system: 'You are a helpful Discord bot.',
    messages: history,
  });

  await thread.post(stream.textStream);
});
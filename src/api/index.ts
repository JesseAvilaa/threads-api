import { Hono } from 'hono';
import { fetchThreadReplies, fetchUserProfile, fetchUserProfileThreads } from '../lib/fetch';

const port = +(Bun.env.PORT ?? 3000);

console.log('Inicializando o servidor API na porta', port);

const app = new Hono();

// Endpoint para obter perfis de usuário com base em userName
app.get('/api/users', async (context) => {
  try {
    // Extraia o parâmetro de consulta userName da solicitação
    const userName = context.req.query('userName');

    // Se o nome de usuário estiver ausente, retorne uma resposta de erro "Nome de usuário ausente" com o código de status 400
    if (!userName) return context.text('Missing userName', 400);

    // Obtenha o perfil do usuário usando o userName fornecido
    const data = await fetchUserProfile({ userName });

    // Retorne os dados buscados como uma resposta JSON
    return context.json(data);
  } catch (error) {
    // Se ocorrer um erro, responda com um código de status 500 e uma mensagem "Erro interno do servidor"
    return context.text('Internal Server Error', 500);
  }
});

// Endpoint para obter um perfil de usuário específico com base no userId
app.get('/api/users/:userId', async (context) => {
  try {
    // Extraia o userId dos parâmetros de solicitação
    const userId = context.req.param('userId');

    // Se o userName estiver ausente, retorne uma resposta de erro "Missing userId" com o código de status 400
    if (!userId) return context.text('Missing userId', 400);

    // Obtenha o perfil do usuário usando o userId fornecido
    const data = await fetchUserProfile({ userId });

    // Retorne os dados buscados como uma resposta JSON
    return context.json(data);
  } catch (error) {
    // Se ocorrer um erro, responda com um código de status 500 e uma mensagem "Erro interno do servidor"
    return context.text('Internal Server Error', 500);
  }
});

// Endpoint para obter respostas de um tópico específico
app.get('/api/threads/:threadId/replies', async (context) => {
  try {
    // Extraia o threadId dos parâmetros de solicitação
    const threadId = context.req.param('threadId');

    // Se o userName estiver ausente, retorne uma resposta de erro "Missing threadId" com código de status 400
    if (!threadId) return context.text('Missing threadId', 400);

    // Obtenha as respostas do tópico usando o threadId fornecido
    const data = await fetchThreadReplies({ threadId });

    // Retorne os dados buscados como uma resposta JSON
    return context.json(data);
  } catch (error) {
    // Se ocorrer um erro, responda com um código de status 500 e uma mensagem "Erro interno do servidor"
    return context.text('Internal Server Error', 500);
  }
});


// Endpoint para obter tópicos de perfil de usuário
app.get('/api/users/:userId/threads', async (context) => {
  try {
    // Extraia o userId dos parâmetros de solicitação
    const userId = context.req.param('userId');

    // Se o userName estiver ausente, retorne uma resposta de erro "Missing userId" com o código de status 400
    if (!userId) return context.text('Missing userId', 400);

    // Busque os tópicos do perfil do usuário usando o userId fornecido
    const data = await fetchUserProfileThreads({ userId });

    // Retorne os dados buscados como uma resposta JSON
    return context.json(data);
  } catch (error) {
    // Se ocorrer um erro, responda com um código de status 500 e uma mensagem "Erro interno do servidor"
    return context.text('Internal Server Error', 500);
  }
});





app.use('*', async (c) => {
  c.notFound();
});

export default {
  port,
  fetch: app.fetch,
};

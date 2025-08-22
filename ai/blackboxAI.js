import axios from 'axios';

export async function blackboxAIChat(prompt) {
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "El prompt debe ser una cadena de texto válida." },
    };
  }

  try {
    const { data } = await axios.post(
      'https://www.blackbox.ai/api/chat',
      {
        messages: [{ role: 'user', content: prompt, id: null }],
        agentMode: {},
        id: null,
        previewToken: null,
        userId: null,
        codeModelMode: true,
        trendingAgentMode: {},
        isMicMode: false,
        userSystemPrompt: null,
        maxTokens: 1024,
        playgroundTopP: null,
        playgroundTemperature: null,
        isChromeExt: false,
        githubToken: '',
        clickedAnswer2: false,
        clickedAnswer3: false,
        clickedForceWebSearch: false,
        visitFromDelta: false,
        isMemoryEnabled: false,
        mobileClient: false,
        userSelectedModel: null,
        validated: '00f37b34-a166-4efb-bce5-1312d87f2f94',
        imageGenerationMode: false,
        webSearchModePrompt: false,
        deepSearchMode: false,
        domains: null,
        vscodeClient: false,
        codeInterpreterMode: false,
        customProfile: {
          name: '',
          occupation: '',
          traits: [],
          additionalInfo: '',
          enableNewChats: false
        },
        webSearchModeOption: {
          autoMode: true,
          webMode: false,
          offlineMode: false
        },
        session: null,
        isPremium: false,
        subscriptionCache: null,
        beastMode: false,
        reasoningMode: false,
        designerMode: false,
        workspaceId: '',
        asyncMode: false
      },
      {
        headers: {
          accept: '*/*',
          'content-type': 'application/json',
          origin: 'https://www.blackbox.ai',
          referer: 'https://www.blackbox.ai/',
          'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
        }
      }
    );

    if (!data) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "No se recibió respuesta del servidor Blackbox AI." },
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: { result: data },
    };
  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || "Error desconocido." },
    };
  }
}

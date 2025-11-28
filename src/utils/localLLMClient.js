/**
 * Local LLM Client
 * Interfaces with local Phi-3 model OR remote Colab server
 * Replaces Google Generative AI API with local/cloud inference
 */

// CONFIGURATION: Change this to use Colab or local server
// Local: 'http://localhost:5000'
// Colab: 'https://your-ngrok-url-from-colab.ngrok.io'
const DEFAULT_SERVER_URL = import.meta.env.VITE_LLM_SERVER_URL || 'http://localhost:5000';

// Show which server we're using (for debugging)
console.log(`🤖 Using LLM Server: ${DEFAULT_SERVER_URL}`);

class LocalLLMClient {
  constructor(serverUrl = DEFAULT_SERVER_URL) {
    this.serverUrl = serverUrl;
    this.isConnected = false;
  }

  /**
   * Check connection to local LLM server
   */
  async checkConnection() {
    try {
      const response = await fetch(`${this.serverUrl}/health`, {
        method: 'GET',
        timeout: 5000
      });
      this.isConnected = response.ok;
      return this.isConnected;
    } catch (err) {
      console.warn('⚠️ LLM server not responding:', err.message);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Generate text using local Phi-3 model
   * @param {string} prompt - Input prompt/user message
   * @param {object} options - Generation options (can include systemPrompt)
   * @returns {Promise<string>} Generated text
   */
  async generateText(prompt, options = {}) {
    const isConnected = await this.checkConnection();
    if (!isConnected) {
      throw new Error(
        `Local LLM server not running at ${this.serverUrl}\n\n` +
        'Options:\n' +
        '1. Start local server: python local_llm_server.py\n' +
        '2. Use Colab: Upload COLAB_SETUP.ipynb and get public URL\n' +
        '3. Update .env: VITE_LLM_SERVER_URL=https://your-colab-url.ngrok.io'
      );
    }

    try {
      const response = await fetch(`${this.serverUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          system_prompt: options.systemPrompt || null,
          max_tokens: options.maxTokens || 500,
          temperature: options.temperature || 0.7,
          top_p: options.topP || 0.95,
          top_k: options.topK || 40,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      return data.generated_text;
    } catch (err) {
      console.error('❌ Error generating text:', err);
      throw err;
    }
  }

  /**
   * Generate AI insights for cognitive profile (JSON response)
   * @param {object} results - Task results data
   * @param {object} scores - Composite scores
   * @param {object} additionalData - Additional context (reaction times, DSM-5, medication)
   * @returns {Promise<object>} AI insights JSON
   */
  async generateCognitiveInsights(results, scores, additionalData = {}) {
    const isConnected = await this.checkConnection();
    if (!isConnected) {
      throw new Error('Local LLM server not running');
    }

    try {
      const response = await fetch(`${this.serverUrl}/api/cognitive-insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          results,
          scores,
          additionalData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      return data.insights;
    } catch (err) {
      console.error('❌ Error generating cognitive insights:', err);
      throw err;
    }
  }

  /**
   * Generate ADHD diagnostic narrative
   * @param {object} patientData - Patient cognitive metrics
   * @returns {Promise<string>} Diagnostic narrative
   */
  async generateADHDNarrative(patientData) {
    const isConnected = await this.checkConnection();
    if (!isConnected) {
      throw new Error('Local LLM server not running');
    }

    try {
      const response = await fetch(`${this.serverUrl}/api/adhd-narrative`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      return data.narrative;
    } catch (err) {
      console.error('❌ Error generating ADHD narrative:', err);
      throw err;
    }
  }

  /**
   * Batch generate for multiple prompts
   * @param {array} prompts - Array of prompts
   * @param {object} options - Generation options
   * @returns {Promise<array>} Array of generated texts
   */
  async batchGenerate(prompts, options = {}) {
    const isConnected = await this.checkConnection();
    if (!isConnected) {
      throw new Error('Local LLM server not running');
    }

    try {
      const response = await fetch(`${this.serverUrl}/api/batch-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompts,
          max_tokens: options.maxTokens || 500,
          temperature: options.temperature || 0.7,
          top_p: options.topP || 0.95,
          top_k: options.topK || 40,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      return data.results;
    } catch (err) {
      console.error('❌ Error in batch generation:', err);
      throw err;
    }
  }

  /**
   * Get server status and model info
   * @returns {Promise<object>} Server status data
   */
  async getStatus() {
    try {
      const response = await fetch(`${this.serverUrl}/api/status`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('❌ Error getting status:', err);
      return { status: 'offline', error: err.message };
    }
  }
}

// Export singleton instance
export const localLLMClient = new LocalLLMClient();

export default LocalLLMClient;


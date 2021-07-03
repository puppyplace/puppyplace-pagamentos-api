import axios from 'axios';

class HttpClient {
  async post(endpoint: string, data: any, config: Record<string, unknown>): Promise<any> {
    const response = await axios.post(endpoint, data, config);
    return response;
  }

  async get(endpoint: string, config: Record<string, unknown>): Promise<any> {
    const response = await axios.get(endpoint, config);
    return response;
  }

  async delete(endpoint: string, config: Record<string, unknown>): Promise<void> {
    await axios.delete(endpoint, config);
  }
}

export default new HttpClient();

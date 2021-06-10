import axios from 'axios'

export const fetch = async (url: string): Promise<{ [key: string]: string | number | boolean | undefined }> =>
    (await axios.get(url)).data
export const getBufferFromUrl = async (url: string): Promise<Buffer> =>
    (await axios.get<Buffer>(url, { responseType: 'arraybuffer' })).data

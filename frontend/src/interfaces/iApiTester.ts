// types.ts - Create this file if you don't have it already
export interface ApiRequest {
    url: string;
    method: string;
    body: string;
    recordedOutput?: string;
    lastSaved?: number;
}
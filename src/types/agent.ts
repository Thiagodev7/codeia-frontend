export interface Agent {
    id: string;
    name: string;
    slug: string;
    model: string; 
    instructions: string;
    isActive: boolean;
    createdAt?: string;
  }
  
  export interface CreateAgentDTO {
    name: string;
    slug: string;
    instructions: string;
    model?: string;
  }
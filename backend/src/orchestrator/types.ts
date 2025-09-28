export interface OrchestrationRequest {
  url: string;
  lang?: string;
  options?: Record<string, any>;
}

export interface OrchestrationResult {
  meta: {
    requestId: string;
    timestamp: string;
    processedBy: string[];
  };
  preprocessed?: any;
  chunks?: any[];
  schemas?: any;
  graph?: any;
  multilingual?: any;
  errors: string[];
}
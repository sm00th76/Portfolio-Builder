export interface PortfolioConfig {
  resumeText: string;
  techStack: string;
  style: string;
  customInstructions: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface GenerationResult {
  files: GeneratedFile[];
  explanation: string;
}

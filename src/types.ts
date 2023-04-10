export interface HelmRelease {
  name: string;
  version: string;
  repository: string;
}

export interface ChangeRequest {
  branch: string;
  updated: boolean;
}

export interface GitopsRelease {
  repository: string;
  main: string;
  file: string;
  path: string;
}

export interface Tree {
    path?: string | undefined;
    mode?: string | undefined;
    type?: string | undefined;
    sha?: string | undefined;
    size?: number | undefined;
    url?: string | undefined;
}
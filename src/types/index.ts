export interface IFile {
  saved: boolean;
  children: IFile[];
  id: string;
  name: string;
  kind: 'file' | 'directory';
  path: string;
}

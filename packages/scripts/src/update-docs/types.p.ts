type FileType =
  | 'BUILDER'
  | 'COMPONENT'
  | 'CONFIG'
  | 'CONSTANT'
  | 'ENTITY'
  | 'FACTORY'
  | 'HANDLER'
  | 'HELPER'
  | 'INDEX'
  | 'MANAGER'
  | 'SCENE'
  | 'SYSTEM'
  | 'TYPE'
  | 'UI'
  | 'UTILS'
  | 'OTHER';

type DiffStatus = 'ADDED' | 'MODIFIED' | 'DELETED';

type PathsMap = {
  [key in FileType]?: string[];
};

type FilePathProp = { filePath: string };

type DirectoryPathProp = { directoryPath: string };

type ChangedFileProp = { file: ChangedFile };

type FileAnalysisProp = { file: FileAnalysis | null };

type ChangedFileListProp = { files: ChangedFile[] };

type DocumentationFilePathsProp = { docPaths: string[] };

type DocumentationFilesPathsProp = { docPaths: string[]; sourcePaths: string[] };

type FilterFilesByStatusProp = {
  file: ChangedFile | null;
  statuses?: DiffStatus[];
  excludedStatuses?: DiffStatus[];
};

type ChangedFile = {
  path: string;
  status: DiffStatus;
};

type FileAnalysis = {
  filePath: string;
  fileType: FileType;
  methods: string[];
};

export type {
  PathsMap,
  FileType,
  ChangedFile,
  FileAnalysis,
  FilePathProp,
  ChangedFileProp,
  FileAnalysisProp,
  DirectoryPathProp,
  ChangedFileListProp,
  FilterFilesByStatusProp,
  DocumentationFilePathsProp,
  DocumentationFilesPathsProp,
};

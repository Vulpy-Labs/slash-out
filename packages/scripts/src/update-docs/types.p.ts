type FileType =
  | 'BUILDER'
  | 'COMPONENT'
  | 'ENTITY'
  | 'INDEX'
  | 'MANAGER'
  | 'SCENE'
  | 'SYSTEM'
  | 'TYPE'
  | 'UI'
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
};

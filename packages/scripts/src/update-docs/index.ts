import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

import simpleGit, { DiffResultTextFile } from 'simple-git';
import { Project } from 'ts-morph';

import {
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
} from './types.p';

const FILE_PATH = fileURLToPath(import.meta.url);
const CURRENT_PATH = path.dirname(FILE_PATH);
const ROOT_PATH = path.resolve(CURRENT_PATH, '../../../../');

const DOCS_ROOT = path.join(ROOT_PATH, 'docs');
const CLIENT_ROOT = path.resolve(ROOT_PATH, 'packages/client');

const git = simpleGit(ROOT_PATH);

const project = new Project({
  tsConfigFilePath: path.join(CLIENT_ROOT, 'tsconfig.json'),
});

const excludedTypes = ['INDEX', 'TYPE', 'COMPONENT', 'ENTITY'] as FileType[];

async function main() {
  console.log('\n🚀 AI Docs Update Started\n');

  const changedFiles = await getChangedFiles();

  if (!changedFiles.length) {
    console.log('✅ No changed files detected.');
    return;
  }

  const relevantFiles = filterRelevantFiles({ files: changedFiles });

  if (!relevantFiles.length) {
    console.log('⚠️ No relevant architectural files found.');
    return;
  }

  const analyses = getAnalyzedFiles({ files: relevantFiles });

  if (!analyses.length) {
    console.log('⚠️ No relevant client source files found.');
    return;
  }

  console.log('\n🔍 Analyzed Files:\n', analyses);

  await removeDeletedDocs({ files: relevantFiles });

  const docPaths = analyses.map(analysis => getDocumentationPath({ filePath: analysis.filePath }));

  ensureDocumentationFiles({ docPaths });

  runAider({ docPaths });

  console.log('\n✅ AI Docs Update Finished\n');
}

async function getChangedFiles(): Promise<ChangedFile[]> {
  const [diff, nameStatus] = await Promise.all([
    git.diffSummary(['HEAD~1..HEAD']),
    git.raw(['diff', '--name-status', 'HEAD~1..HEAD']),
  ]);

  const statusByPath = new Map(
    nameStatus
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(line => {
        const [code, ...paths] = line.split('\t');

        const index = paths.length - 1;
        const filePath = paths[index];
        const statusType = code[0];
        const status =
          {
            A: 'ADDED',
            D: 'DELETED',
          }[statusType] || 'MODIFIED';

        return [filePath, status];
      })
  );

  return diff.files.map(diffFile => {
    const file = diffFile as DiffResultTextFile;

    const status = (statusByPath.get(file.file) || 'MODIFIED') as ChangedFile['status'];

    return {
      status,
      path: file.file,
    };
  });
}

function getAnalyzedFiles({ files }: ChangedFileListProp): FileAnalysis[] {
  return files
    .filter(file => filterFilesByStatus({ file, excludedStatuses: ['DELETED'] }))
    .map(file => analyzeFile({ file }))
    .filter(file => filterRelevantFileByType({ file }))
    .filter(Boolean) as FileAnalysis[];
}

function getDocumentationPath({ filePath }: FilePathProp) {
  const normalized = filePath.replace(/^packages\/client\/src\//, '').replace(/\.tsx?$/, '.md');

  return path.join(DOCS_ROOT, 'client', normalized);
}

function filterRelevantFiles({ files }: ChangedFileListProp): ChangedFile[] {
  return files.filter(file => {
    return file.path.endsWith('.ts') || file.path.endsWith('.tsx');
  });
}

function filterRelevantFileByType({ file }: FileAnalysisProp): boolean {
  return !!file && !excludedTypes.includes(file.fileType);
}

function filterFilesByStatus({
  file,
  statuses = [],
  excludedStatuses = [],
}: FilterFilesByStatusProp): boolean {
  if (!file) return false;

  if (excludedStatuses.includes(file.status)) return false;

  return statuses.length === 0 || statuses.includes(file.status);
}

function analyzeFile({ file }: ChangedFileProp): FileAnalysis | null {
  const filePath = file.path;

  const absoluteFilePath = path.resolve(ROOT_PATH, filePath);
  const sourceFile = project.getSourceFile(absoluteFilePath);

  if (!sourceFile) return null;

  const methods = sourceFile
    .getClasses()
    .flatMap(classDeclaration => classDeclaration.getMethods().map(method => method.getName()));

  return {
    methods,
    filePath,
    fileType: inferFileType({ filePath }),
  };
}

function inferFileType({ filePath }: FilePathProp): FileType {
  const lowerPath = filePath.toLowerCase();
  const pathsMap: PathsMap = {
    INDEX: ['/index'],
    TYPE: ['/type.', '/types.'],
    UI: ['/ui/'],
    SCENE: ['/scenes/'],
    SYSTEM: ['/systems/'],
    ENTITY: ['/entities/'],
    MANAGER: ['/managers/'],
    BUILDER: ['/builders/'],
    COMPONENT: ['/components/'],
  };

  for (const [type, keywords] of Object.entries(pathsMap)) {
    const hasKeyword = keywords.some(keyword => lowerPath.includes(keyword));
    if (hasKeyword) return type as FileType;
  }

  return 'OTHER';
}

function ensureDocumentationFiles({ docPaths }: DocumentationFilePathsProp) {
  for (const docPath of docPaths) {
    ensureDirectoryExists({ directoryPath: path.dirname(docPath) });

    if (!fs.existsSync(docPath)) {
      fs.writeFileSync(docPath, '', 'utf8');
    }
  }
}

function ensureDirectoryExists({ directoryPath }: DirectoryPathProp) {
  if (fs.existsSync(directoryPath)) return;

  fs.mkdirSync(directoryPath, {
    recursive: true,
  });
}

async function removeDeletedDocs({ files }: ChangedFileListProp) {
  const deletedFiles = files.filter(file => filterFilesByStatus({ file, statuses: ['DELETED'] }));

  for (const file of deletedFiles) {
    const docPath = getDocumentationPath({ filePath: file.path });

    if (fs.existsSync(docPath)) fs.unlinkSync(docPath);
  }
}

function runAider({ docPaths }: DocumentationFilePathsProp) {
  const args = [
    ...docPaths,
    '--read',
    'docs/agents.md',
    '--read',
    'docs/templates/client-documentation.md',
    '--message-file',
    'docs/prompts/ai-documentation-architect.md',
    '--edit-format=diff',
    '--chat-language=en',
    '--yes-always',
    '--architect',
    '--no-pretty',
  ];

  execFileSync('aider', args, {
    stdio: 'inherit',
    cwd: ROOT_PATH,
  });
}

main().catch(error => {
  console.error('\n❌ AI Docs Update Failed\n');

  console.error(error);

  process.exit(1);
});

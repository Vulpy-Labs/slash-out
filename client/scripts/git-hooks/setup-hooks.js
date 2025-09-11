const fs = require('fs');
const path = require('path');

const sourceHookPath = path.join(__dirname, 'commit-msg');
const gitDir = path.join(__dirname, '..', '..', '.git');
const gitHooksDir = path.join(__dirname, '..', '..', '.git', 'hooks');
const targetHookPath = path.join(gitHooksDir, 'commit-msg');

if (!fs.existsSync(gitDir)) {
  console.error(
    '❌ Pasta ".git" não encontrada. Você inicializou um repositório git?',
  );
  process.exit(1);
}

if (!fs.existsSync(gitHooksDir)) {
  try {
    fs.mkdirSync(gitHooksDir);
  } catch (error) {
    console.error('❌ Falha ao criar o diretório de hooks:', error);
    process.exit(1);
  }
}

try {
  fs.copyFileSync(sourceHookPath, targetHookPath);
  fs.chmodSync(targetHookPath, 0o755);
  console.log('✅ commit-msg hook instalado com sucesso!.');
} catch (error) {
  console.error('❌ Falha ao instalar commit-msg hook:', error);
  process.exit(1);
}

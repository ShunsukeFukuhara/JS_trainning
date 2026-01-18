import { listIssues, createIssue, closeIssue, showHelp } from './github.js';
const args = process.argv.slice(2);

const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  console.error('GITHUB_TOKEN is not set');
  process.exit(1);
}

(async () => {
  try {
    const [command, ...rest] = args.filter(
      (a) => !['-v', '--verbose'].includes(a),
    );

    switch (command) {
      case 'list':
        await listIssues(TOKEN, rest[0], rest[1]);
        break;

      case 'create':
        await createIssue(TOKEN, rest[0], rest[1], rest[2], rest[3]);
        break;

      case 'close':
        await closeIssue(TOKEN, rest[0], rest[1], rest[2]);
        break;

      case '-h':
      case '--help':
        showHelp();
        break;

      case '-v':
      case '--verbose':
        // Handled above
        break;

      default:
        console.error('不明なコマンドです。');
        showHelp();
        process.exit(1);
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();

const core = require('@actions/core');

async function main() {
  const ghRef = core.getInput('ghRef');
  const tagFromInput = core.getInput('tagFromInput');

  core.debug(`ghRef: ${ghRef}`);
  core.debug(`tagFromInput: ${tagFromInput}`);

  const tag = ghRef.startsWith('refs/tags/v') ? ghRef : tagFromInput;

  core.debug(`tag: ${tag}`);

  core.setOutput('tag', tag);
}

main().catch((err) => {
  core.setFailed(err);
});

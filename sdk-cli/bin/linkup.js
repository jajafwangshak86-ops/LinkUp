#!/usr/bin/env node
/**
 * linkup-cli — CLI for LinkUp on Stacks/Bitcoin
 * Usage: linkup stats | linkup user <address> | linkup post <id>
 */
const { getStats, getUser, getPost } = require('linkup-stacks-sdk');
const [,, cmd, arg] = process.argv;

(async () => {
  if (cmd === 'stats') {
    console.log(await getStats());
  } else if (cmd === 'user' && arg) {
    console.log(await getUser(arg));
  } else if (cmd === 'post' && arg) {
    console.log(await getPost(Number(arg)));
  } else {
    console.log('Usage: linkup stats | linkup user <address> | linkup post <id>');
  }
})();

#!/usr/bin/env node
/**
 * linkup-cli — CLI for LinkUp on Stacks/Bitcoin
 * Usage: linkup stats | linkup user <address> | linkup post <id> | linkup check <address>
 */
const { getStats, getUser, getPost, isRegistered, remainingAllowance, fromUstx } = require('linkup-stacks-sdk');
const [,, cmd, arg] = process.argv;

(async () => {
  try {
    if (cmd === 'stats') {
      const s = await getStats();
      console.log('LinkUp Stats:');
      console.log(`  Users:  ${s.totalUsers}`);
      console.log(`  Posts:  ${s.totalPosts}`);
      console.log(`  Tips:   ${s.totalTips}`);
    } else if (cmd === 'user' && arg) {
      const u = await getUser(arg);
      console.log(u ? JSON.stringify(u, null, 2) : 'User not found');
    } else if (cmd === 'post' && arg) {
      const p = await getPost(Number(arg));
      console.log(p ? JSON.stringify(p, null, 2) : 'Post not found');
    } else if (cmd === 'check' && arg) {
      const reg = await isRegistered(arg);
      const allowance = await remainingAllowance(arg);
      console.log(`Address: ${arg}`);
      console.log(`Registered: ${reg}`);
      console.log(`Daily allowance remaining: ${fromUstx(allowance)} STX`);
    } else {
      console.log('Usage: linkup stats | linkup user <SP...> | linkup post <id> | linkup check <SP...>');
    }
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();

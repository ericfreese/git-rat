import modes from './modes';
import { logCommand } from './modes/log';

Object.keys(modes).forEach(name => {
  Rat.registerMode(`git.${name}`, modes[name]);
});

class GitRat {
  status() {
    Rat.pushPager(new Rat.CmdPager('git.status', 'git status -s -uall'));
  }

  log() {
    Rat.pushPager(new Rat.CmdPager('git.log', logCommand()));
  }
}

if (!Rat.git) {
  Rat.git = new GitRat();
}

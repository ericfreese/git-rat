import { addChildPagerHandler } from '../utils';
import { logCommand } from './log';

export default pager => {
  var pagerContext = pager.getContext();
  var workingDir = pager.getWorkingDir();

  pager.addAnnotator(new Rat.MatchAnnotator(
    'git rev-list --all --reflog --abbrev=7 --abbrev-commit',
    workingDir,
    'git_commit',
    pagerContext
  ));

  addChildPagerHandler({
    pager,
    keyEvent: 's',
    requirements: 'git_commit',
    mode: 'git.show',
    command: 'git show --stat=400 -p $git_commit | diff-highlight',
  });

  addChildPagerHandler({
    pager,
    keyEvent: 'l',
    requirements: 'git_commit',
    mode: 'git.log',
    command: logCommand('$git_commit')
  });
}

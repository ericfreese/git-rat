import commits from './commits';
import { addChildPagerHandler, addExecHandler } from '../utils';

const BASE_LOG_CMD = "git log --graph --pretty=format:'%Cred%h%Creset%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative"

export const logCommand = revision => (
  revision ? `${BASE_LOG_CMD} ${revision}` : BASE_LOG_CMD
)

export default pager => {
  commits(pager);

  const pagerContext = pager.getContext();
  const workingDir = pager.getWorkingDir();

  addExecHandler({
    pager,
    keyEvent: 'r,b',
    requirements: 'git_commit',
    command: 'git rebase --interactive $git_commit',
    confirm: true
  })

  addExecHandler({
    pager,
    keyEvent: 'f,u',
    requirements: 'git_commit',
    command: 'git commit --fixup=$git_commit',
    confirm: true
  })

  addExecHandler({
    pager,
    keyEvent: 'c,p',
    requirements: 'git_commit',
    command: 'git cherry-pick $git_commit',
    confirm: true
  })

  addExecHandler({
    pager,
    keyEvent: 'r,v',
    requirements: 'git_commit',
    command: 'git revert $git_commit',
    confirm: true
  })

  addExecHandler({
    pager,
    keyEvent: 'r,h,h',
    requirements: 'git_commit',
    command: 'git reset --hard $git_commit',
    confirm: true
  })

  addExecHandler({
    pager,
    keyEvent: 'c,o',
    requirements: 'git_commit',
    command: 'git checkout $git_commit',
    confirm: true
  })
}

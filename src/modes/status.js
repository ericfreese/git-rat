import { addChildPagerHandler } from '../utils';

let statusPagers = [];

const addStatusPager = pager => {
  statusPagers.push(pager);
};

const removeStatusPager = pager => {
  const index = statusPagers.indexOf(pager);

  if (index >= 0) {
    statusPagers.splice(index, 1);
  }
};

export const reloadStatusPagers = () => statusPagers.forEach(p => p.reload())

export default pager => {
  var ctx = pager.getContext();
  var workingDir = pager.getWorkingDir();

  addStatusPager(pager);
  pager.onDestroy(() => { removeStatusPager(pager); });

  pager.addAnnotator(new Rat.MatchAnnotator(
    'git ls-files --cached --modified --others --exclude-standard',
    workingDir,
    'git_filename',
    ctx
  ));

  pager.addEventHandler('a', 'git_filename', eCtx => {
    Rat.exec('git add $git_filename', eCtx);
    pager.reload();
  });

  pager.addEventHandler('r', 'git_filename', eCtx => {
    Rat.exec('git reset $git_filename > /dev/null', eCtx);
    pager.reload();
  });

  addChildPagerHandler({
    pager,
    keyEvent: 'd,d',
    requirements: 'git_filename',
    mode: 'git.stage',
    command: 'echo $word_diff && git diff -U$context $word_diff $git_filename | diff-highlight',
  });

  addChildPagerHandler({
    pager,
    keyEvent: 'd,a',
    requirements: 'git_filename',
    mode: 'git.unstage',
    command: 'git diff -U$context $word_diff --cached $git_filename | diff-highlight',
  });

  pager.addEventHandler('c,o', 'git_filename', eCtx => {
    Rat.confirmExec('git checkout $git_filename', eCtx, () => {
      pager.reload();
    });
  });

  pager.addEventHandler('S-d', 'git_filename', eCtx => {
    Rat.confirmExec('rm $git_filename', eCtx, () => {
      pager.reload();
    });
  });

  addChildPagerHandler({
    pager,
    keyEvent: 'v',
    requirements: 'git_filename',
    mode: 'git.source',
    command: 'cat $git_filename',
  });

  pager.addEventHandler('e', 'git_filename', eCtx => {
    Rat.exec('${VISUAL:-${EDITOR:-vi}} $git_filename', eCtx);
    pager.reload();
  });

  pager.addEventHandler('S-c', () => {
    Rat.confirmExec('git commit', ctx, () => { pager.reload() });
  });

  pager.addEventHandler('S-a', () => {
    Rat.confirmExec('git commit --amend', ctx, () => { pager.reload() });
  });
}

export default pager => {
  var pagerContext = pager.getContext();
  var workingDir = pager.getWorkingDir();

  pager.addAnnotator(new Rat.MatchAnnotator(
    'git ls-tree --name-only -r $git_commit',
    workingDir,
    'git_filename',
    pagerContext
  ));

  pager.addEventHandler('d', 'git_filename', cursorContext => {
    Rat.addChildPager(
      pager,
      new Rat.CmdPager(
        'git.diff',
        'git log -p --follow -1 $git_commit -- "$git_filename" | diff-highlight',
        workingDir,
        Rat.mergeContext(pagerContext, cursorContext)
      ),
      'd'
    );
  });
}

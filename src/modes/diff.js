import { addChildPagerHandler } from '../utils';

const opts = {
  context: 3,
  wordDiff: false
};

const applyOpts = ctx => {
  ctx.set('context', opts.context);

  if (opts.wordDiff) {
    ctx.set('word_diff', '--word-diff=color');
  } else {
    ctx.set('word_diff', '');
  }
}

export default pager => {
  var pagerContext = pager.getContext();
  var workingDir = pager.getWorkingDir();

  applyOpts(pagerContext);

  pager.addAnnotator(new Rat.ExternalAnnotator(
    'annotate-diff --mode hunks',
    workingDir,
    'hunk_patch',
    pagerContext
  ));

  pager.addAnnotator(new Rat.ExternalAnnotator(
    'annotate-diff --mode lines',
    workingDir,
    'line_patch',
    pagerContext
  ));

  pager.addEventHandler('w,d', () => {
    opts.wordDiff = !opts.wordDiff;
    applyOpts(pagerContext);
    pager.reload();
  });

  pager.addEventHandler('[', () => {
    opts.context--
    applyOpts(pagerContext);
    pager.reload();
  });

  pager.addEventHandler(']', () => {
    opts.context++
    applyOpts(pagerContext);
    pager.reload();
  });

  addChildPagerHandler({
    pager,
    keyEvent: 'S-l',
    requirements: 'line_patch',
    mode: 'debug',
    command: 'echo $line_patch',
  });

  addChildPagerHandler({
    pager,
    keyEvent: 'S-h',
    requirements: 'hunk_patch',
    mode: 'debug',
    command: 'echo $hunk_patch',
  });
}

import diff from './diff';
import { reloadStatusPagers } from './status';

export default pager => {
  diff(pager);

  var pagerContext = pager.getContext();
  var workingDir = pager.getWorkingDir();

  pager.addEventHandler('r', 'hunk_patch', cursorContext => {
    Rat.exec(
      'echo -nE "$hunk_patch" | git apply --cached --unidiff-zero --reverse -',
      Rat.mergeContext(pagerContext, cursorContext)
    );

    pager.reload();
    reloadStatusPagers();
  });

  pager.addEventHandler('1', 'line_patch', cursorContext => {
    Rat.exec(
      'echo -nE "$line_patch" | git apply --cached --unidiff-zero --reverse -',
      Rat.mergeContext(pagerContext, cursorContext)
    );

    pager.reload();
    reloadStatusPagers();
  });
}

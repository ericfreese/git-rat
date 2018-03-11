export const addChildPagerHandler = ({ pager, keyEvent, requirements, mode, command }) => {
  const wd = pager.getWorkingDir();
  const ctx = pager.getContext();

  pager.addEventHandler(keyEvent, requirements, eCtx => {
    const child = new Rat.CmdPager(mode, command, wd, Rat.mergeContext(ctx, eCtx));
    Rat.addChildPager(pager, child, keyEvent);
  });
};

export const addExecHandler = ({ pager, keyEvent, requirements, command, confirm = false }) => {
  pager.addEventHandler(keyEvent, requirements, ctx => {
    if (confirm) {
      Rat.confirmExec(command, ctx, () => {
        pager.reload();
      });
    } else {
      Rat.exec(command, ctx);
      pager.reload();
    }
  });
};

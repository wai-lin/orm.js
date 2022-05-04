export type TContext<C> = C | null

export type TSetContext<C> = (payload: TContext<C>) => TContext<C>

export interface TOperationLifeCycleFuncs<C> {
  idle: {
    exec: (ctx: TContext<C>, setCtx: TSetContext<C>) => void
  }
  beforeOperation: {
    hook: (ctx: TContext<C>, setCtx: TSetContext<C>) => void
    exec: (ctx: TContext<C>, setCtx: TSetContext<C>) => void
  }
  execOperation: {
    hook: (ctx: TContext<C>, setCtx: TSetContext<C>) => void
    exec: (ctx: TContext<C>, setCtx: TSetContext<C>) => Promise<any>
  }
  // oneOf
  operationSuccess: {
    hook: (ctx: TContext<C>, setCtx: TSetContext<C>) => void
    exec: (ctx: TContext<C>, setCtx: TSetContext<C>) => void
  }
  operationFailed: {
    hook: (ctx: TContext<C>, setCtx: TSetContext<C>) => void
    exec: (ctx: TContext<C>, setCtx: TSetContext<C>) => void
  }
  // oneOf end
  afterOperation: {
    hook: (ctx: TContext<C>, setCtx: TSetContext<C>) => void
    exec: (ctx: TContext<C>, setCtx: TSetContext<C>) => void
  }
}

export const operate = <C>(
  lifeCycleFuncs: TOperationLifeCycleFuncs<C>,
  initialCtx: TContext<C> = null,
) => {
  // eslint-disable-next-line prefer-const
  let context: TContext<C> = initialCtx
  const setContext = (payload: TContext<C>) => (context = payload)

  lifeCycleFuncs.idle.exec(context, setContext)

  lifeCycleFuncs.beforeOperation.hook(context, setContext)
  lifeCycleFuncs.beforeOperation.exec(context, setContext)

  lifeCycleFuncs.execOperation.hook(context, setContext)
  return lifeCycleFuncs.execOperation
    .exec(context, setContext)
    .then(() => {
      console.log('exec then cb.')
      lifeCycleFuncs.operationSuccess.hook(context, setContext)
      lifeCycleFuncs.operationSuccess.exec(context, setContext)
    })
    .catch(() => {
      console.log('exec catch cb.')
      lifeCycleFuncs.operationFailed.hook(context, setContext)
      lifeCycleFuncs.operationFailed.exec(context, setContext)
    })
    .finally(() => {
      console.log('exec finally cb.')
      lifeCycleFuncs.afterOperation.hook(context, setContext)
      lifeCycleFuncs.afterOperation.exec(context, setContext)
      context = null
    })
}

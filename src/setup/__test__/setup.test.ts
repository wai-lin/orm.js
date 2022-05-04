import { operate, TOperationLifeCycleFuncs } from '~/setup/setup'
import { expect, it } from 'vitest'

const lifeCycleFuncs: TOperationLifeCycleFuncs<string[]> = {
  idle: {
    exec: (ctx, setCtx) => Array.isArray(ctx) && setCtx([...ctx, 'idle']),
  },
  beforeOperation: {
    hook: (ctx, setCtx) =>
      Array.isArray(ctx) && setCtx([...ctx, 'beforeOperationHook']),
    exec: (ctx, setCtx) =>
      Array.isArray(ctx) && setCtx([...ctx, 'beforeOperationFunc']),
  },
  execOperation: {
    hook: (ctx, setCtx) =>
      Array.isArray(ctx) && setCtx([...ctx, 'execOperationHook']),
    exec(ctx, setCtx) {
      Array.isArray(ctx) && setCtx([...ctx, 'execOperationFunc'])
      return Promise.resolve()
    },
  },
  operationSuccess: {
    hook: (ctx, setCtx) =>
      Array.isArray(ctx) && setCtx([...ctx, 'operationSuccessHook']),
    exec: (ctx, setCtx) =>
      Array.isArray(ctx) && setCtx([...ctx, 'operationSuccessFunc']),
  },
  operationFailed: {
    hook: (ctx, setCtx) =>
      Array.isArray(ctx) && setCtx([...ctx, 'operationFailedHook']),
    exec: (ctx, setCtx) =>
      Array.isArray(ctx) && setCtx([...ctx, 'operationFailedFunc']),
  },
  afterOperation: {
    hook: (ctx, setCtx) =>
      Array.isArray(ctx) && setCtx([...ctx, 'afterOperationHook']),
    exec: (ctx, setCtx) =>
      Array.isArray(ctx) && setCtx([...ctx, 'afterOperationFunc']),
  },
}

it('should runs life cycles sequentially. with success', () => {
  let ctx: string[] = []

  lifeCycleFuncs.afterOperation.exec = (c, setCtx) => {
    if (Array.isArray(c)) {
      setCtx([...c, 'afterOperationFunc'])
      ctx = c
    }
  }

  operate<typeof ctx>(lifeCycleFuncs, ctx).then(() => {
    expect(ctx).toEqual([
      'idle',
      'beforeOperationHook',
      'beforeOperationFunc',
      'execOperationHook',
      'execOperationFunc',
      'operationSuccessHook',
      'operationSuccessFunc',
      'afterOperationHook',
      'afterOperationFunc',
    ])
  })
})

it('should runs life cycles sequentially. with error', () => {
  let ctx: string[] = []

  lifeCycleFuncs.execOperation.exec = (ctx, setCtx) => {
    Array.isArray(ctx) && setCtx([...ctx, 'execOperationFunc'])
    return Promise.reject(new Error('Hey'))
  }

  lifeCycleFuncs.afterOperation.exec = (c, setCtx) => {
    if (Array.isArray(c)) {
      console.log('after exec')
      setCtx([...c, 'afterOperationFunc'])
      ctx = c
    }
  }

  operate<typeof ctx>(lifeCycleFuncs, ctx)
    .catch(() => {
      //   [
      //   'idle',
      //   'beforeOperationHook',
      //   'beforeOperationFunc',
      //   'execOperationHook',
      //   'execOperationFunc',
      //   'operationHook',
      //   'operationFunc',
      //   'afterOperationHook',
      //   'afterOperationFunc',
      // ]
    })
    .finally(() => {
      expect(ctx).toBe({})
    })
})

import { createMachine } from 'xstate'

export const ORMSetupMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QHkBKBZAymALgVwAd0BDAYwAsBLAOzADpKIAbMAYgHsCwAnYnMRKALtYlHJXbVBIAB6IAtACYAHAE46AVmUA2ZQGZlABj2LFhjQBYANCACeC04c2qNhgIzu3atwHYAvn42aFi4hCQUNPQARmAAZuzcYMhcvOKSrLQyONLComlSSLIOPj50OkbKGqo+ihZ6ej56NvYIbm50FqouGoraFio6xgFBGNj4RGRUtHRgMmCkyTx8EtSssHikpHDwhbliK9JyCPIaPhZ0XVoaeoaK1XVNdohuFtp0JdoeNz6f2jfKwxAwTGYUmkRmcwWKWW6VixEoLAgORE+0khwcF1Uij0f1chiMejcqgazWer3eP3x2iqPlU3g0gOBoQmEWmnCW+UwGy2sFgGVm2V2KPy6OOihKZV0+L0qjcvW0ilJCG+dGlygsFks+nxDMCQNGzPCU3o7NSKwAYvDEfyssi8gdCkcnGpDHUjKddMS3NolRoie8FRYvF1iY09IyDeMjeDiLF+NxFmb0nbUQVQEd5D59O9LJ9aaYs1pff6frU3A0qt67gE9dR2BA4NImVGwdNGCwUyLHQojO0quY-vplOXTkqlOLVS5DIYfFTieG9c3QazonEEkloV2hMKHemFAZ2qpXkS6eL6jofU9ji83mdZdpp7Sj3KAYvI8vjRD5omYWmQHstyKY4KzKHwtHVPRNTca5rCvVRb0pFwXkUb1XG0CMQhbFc6FNX8uU2bZO13ID5G0Hx2luciZ3I2dtBcJVFFOVUhxxT46g8CwMJBFlP1w-JLQRSAiLRbtji6TFsTIrRdFpZRFSvRjSjVViXkJV0uMNVt6FjeMf0AgDiIzEC9B6V58TqB94KVV51FLfobnFaCGg0rDjWEv8MzkjRnAHAwDxMnwxxuJxDCPOkzhqcwTPQmsgA */
  createMachine(
    {
      initial: 'idle',
      states: {
        idle: {
          on: {
            operate: {
              target: 'beforeOperation',
            },
          },
        },
        beforeOperation: {
          invoke: [
            {
              src: 'beforeOperationHook',
            },
            {
              src: 'beforeOperationFunc',
            },
          ],
          on: {
            next: {
              target: 'execOperation',
            },
          },
        },
        execOperation: {
          invoke: [
            {
              src: 'execOperationHook',
            },
            {
              src: 'execOperation',
            },
          ],
          on: {
            success: {
              target: 'operationSuccess',
            },
            failed: {
              target: 'operationFailed',
            },
          },
        },
        operationSuccess: {
          invoke: [
            {
              src: 'operationSuccessHook',
            },
            {
              src: 'operationSuccessFunc',
            },
          ],
          on: {
            next: {
              target: 'afterOperation',
            },
          },
        },
        operationFailed: {
          invoke: [
            {
              src: 'operationFailedHook',
            },
            {
              src: 'operationFailedFunc',
            },
          ],
          on: {
            next: {
              target: 'afterOperation',
            },
          },
        },
        afterOperation: {
          invoke: [
            {
              src: 'afterOperationHook',
            },
            {
              src: 'afterOperationFunc',
            },
          ],
          always: {
            target: 'idle',
          },
        },
      },
      id: 'ORMSetupMachine',
    },
    {},
  )

import { operations } from './operations'

export interface ModelConfig<D = any> {
  entity: string
  initialData?: D[]
}

class QueryModel<D> {
  _entity: string = ''
  fields: D = {} as any
  #data: D[] = []

  constructor(config: ModelConfig<D>) {
    this._entity = config.entity
    this.#data = config.initialData ?? []
  }

  get() {
    return this.#data
  }

  find(where?: (item: D) => boolean) {
    return new QueryModel({
      entity: this._entity,
      initialData: operations(this.#data).find(where),
    })
  }

  count() {
    return operations(this.#data).count()
  }

  indexAt(idx: number) {
    return new QueryModel({
      entity: this._entity,
      initialData: operations(this.#data).indexAt(idx),
    })
  }

  limit(count: number) {
    return new QueryModel({
      entity: this._entity,
      initialData: operations(this.#data).limit(count),
    })
  }

  join<ToJoinData>(
    toJoinData: ToJoinData[],
    options: {
      relation: Partial<Record<keyof D, keyof ToJoinData>>
      populateKey: keyof D
      conditional?: 'AND' | 'OR'
    },
  ) {
    return new QueryModel({
      entity: this._entity,
      initialData: operations(this.#data).join<ToJoinData>(toJoinData, options),
    })
  }
}

class CombinedModel<D> extends QueryModel<D> {
  _entity: string = ''
  #data: D[] = []

  constructor(config: ModelConfig<D>) {
    super(config)
    this._entity = config.entity
    this.#data = config.initialData ?? []
  }

  create(value: D) {
    return new CombinedModel({
      entity: this._entity,
      initialData: operations(this.#data).create(value),
    })
  }

  createOrMerge(value: Partial<D>, finder: (item: D) => boolean) {
    return new CombinedModel({
      entity: this._entity,
      initialData: operations(this.#data).createOrMerge(value, finder),
    })
  }

  createMany(valueMap: D[]) {
    return new CombinedModel({
      entity: this._entity,
      initialData: operations(this.#data).createMany(valueMap),
    })
  }

  update(value: Partial<D>, where: (item: D) => boolean) {
    return new CombinedModel({
      entity: this._entity,
      initialData: operations(this.#data).update(value, where),
    })
  }

  delete(cb: (item: D) => boolean) {
    return new CombinedModel({
      entity: this._entity,
      initialData: operations(this.#data).delete(cb),
    })
  }

  purge() {
    this.#data = []
  }
}

export class Model<D = any> extends CombinedModel<D> {
  _entity: string = ''

  constructor(config: ModelConfig<D>) {
    super(config)
    this._entity = config.entity
  }
}

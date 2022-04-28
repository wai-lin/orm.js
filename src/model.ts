import { operations } from './operations'

interface ModelConfig<D = any> {
  entity: string
  initialData?: D[]
}

export class QueryModel<D> {
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

  find() {
    return new QueryModel({
      entity: this._entity,
      initialData: operations(this.#data).find(),
    })
  }

  count() {
    return operations(this.#data).count()
  }

  where(cb: (item: D) => boolean) {
    return new QueryModel({
      entity: this._entity,
      initialData: operations(this.#data).where(cb),
    })
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
}

export class CombinedModel<D> extends QueryModel<D> {
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

  createMany(valueMap: D[]) {
    return new CombinedModel({
      entity: this._entity,
      initialData: operations(this.#data).createMany(valueMap),
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
    return this.#data
  }
}

export class Model<D = any> extends CombinedModel<D> {
  _entity: string = ''

  constructor(config: ModelConfig<D>) {
    super(config)
    this._entity = config.entity
  }
}

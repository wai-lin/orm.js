import { SetOptional } from 'type-fest'

export function operations<D = any>(d: D[]) {
  const data: D[] = d

  return {
    find() {
      return data
    },

    indexAt(idx: number) {
      return data.slice(idx)
    },

    limit(count: number) {
      return data.slice(undefined, count)
    },

    count() {
      return data.length
    },

    where(cb: (item: D) => boolean) {
      return data.filter((d) => cb(d))
    },

    create(value: D) {
      return [...data, value]
    },

    createMany(valueMap: D[]) {
      return [...data, ...valueMap]
    },

    update(updateValue: SetOptional<D, keyof D>) {
      return data.map((item) => ({ ...item, ...updateValue }))
    },

    delete(cb: (item: D) => boolean) {
      return data.filter((item) => !cb(item))
    },
  }
}

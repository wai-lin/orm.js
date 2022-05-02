export function operations<D = any>(d: D[]) {
  const data: D[] = d

  return {
    find(where?: (item: D) => boolean) {
      if (where) return data.filter((item) => where(item))
      return data
    },

    indexAt(idx: number) {
      return data.slice(idx)
    },

    limit(count: number) {
      return data.slice(undefined, count)
    },

    join<ToJoinData>(
      toJoinData: ToJoinData[],
      {
        relation,
        populateKey,
        conditional = 'OR',
      }: {
        relation: Partial<Record<keyof D, keyof ToJoinData>>
        populateKey: keyof D
        conditional?: 'AND' | 'OR'
      },
    ) {
      // transform relational object to key, value pairs
      // eg. { id: 'authorId' } => [ ['id', 'authorId'] ]
      const keysPair = Object.entries(relation).map(([key, val]) => [key, val])

      // populate data with relational data
      return data.map((itm) => {
        // set each item
        const item = itm as any

        // populate assign
        // filter the data need to populate
        item[populateKey] = toJoinData.filter((toJoin) => {
          const matchedPair = keysPair
            // create match data boolean pairs with the generate key pairs
            // eg. loop of author.id === book.authorId => [true, false]
            .map(([itemKey, toJoinKey]) => {
              return (
                item[itemKey as string] === (toJoin as any)[toJoinKey as string]
              )
            })
            // finally reduce the result back to single boolean value with the conditional
            // AND, OR operator
            .reduce((p, a) => {
              if (conditional === 'AND') return p && a
              return p || a
            })
          // return matched result to filter back
          return matchedPair
        })
        return item as D
      })
    },

    count() {
      return data.length
    },

    create(value: D) {
      return [...data, value]
    },

    createOrMerge(value: Partial<D>, finder: (item: D) => boolean) {
      if (data.some((item) => finder(item)))
        return data.map((item) => {
          if (finder(item)) return { ...item, ...value }
          return item
        })
      return [...data, value]
    },

    createMany(valueMap: D[]) {
      return [...data, ...valueMap]
    },

    update(updateValue: Partial<D>, where: (item: D) => boolean) {
      return data.map((item) => {
        if (where(item)) return { ...item, ...updateValue }
        return item
      })
    },

    delete(cb: (item: D) => boolean) {
      return data.filter((item) => !cb(item))
    },
  }
}

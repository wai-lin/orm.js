### ORM API

Primitive ORM to use whether in BROWSER or NODE environment.

```ts
// API PROPOSAL

interface Author {
  id: string
}
const authors = new Model('authors')

// RETRIEVE
authors.find().get() // return all
authors.find().count().get()
authors.find().indexAt(1).limit(10).get()
authors
  .where((author) => author.isActivated)
  .find()
  .get() // return activated users

// CREATE
authors.create({ id: '1', name: 'Ag Ag', isActivated: true }).get()
authors.createMany([{}, {}]).get()
authors
  .createOrMerge(
    { id: '1', name: 'Ag Ag', isActivated: false },
    (author) => author.id === '1',
  )
  .get()

// UPDATE
authors.update({ name: 'ag ag' }, (author) => author.id === '1').get()

// DELETE
authors.delete((author) => author.id === '2').get()
authors.purge() // delete all

// RELATIONS
const books = new Model('books')
books.create({ id: '1', name: 'The Ending of Life', authorId: '1' })

authors.join(books, {
  populateTo: 'books',
  relation: { id: 'authorId' },
  conditional: 'AND',
})
```

---

### Validation API

> Should work with existing libraries like `zod`, `yup`, etc...

```ts
// API PROPOSAL

class Validation<D> extends Model<D> {
  constructor(config: ModelConfig<D>) {
    super(config)
  }

  schema() {}
}

import * as z from 'zod'

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number().optional(),
})
```

---

### Storage/Cache Layer API

---

### Fetch API

---

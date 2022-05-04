### Stages

- Stage 0 - Still in brain storming
- Stage 1 - Considering to implement
- Stage 2 - Implementation started/ongoing (APIs still may change during development)
- Stage 3 - Near release (alpha)

---

### APIs

- [ ] ORM API `Stage 2`
- [ ] Validation API `Stage 0`
- [ ] Storage/Cache API `Stage 0`
- [ ] Fetch API `Stage 0`
- [ ] Setup API `Stage 0`

---

### ORM API `Stage 2`

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
const books = new Model('books').create({
  id: '1',
  name: 'The Ending of Life',
  authorId: '1',
})

authors.join(books, {
  populateTo: 'books',
  relation: { id: 'authorId' },
  conditional: 'AND',
})
```

---

### Validation API `Stage 0`

> Should work with existing libraries like `zod`, `yup`, etc...

```ts
// API PROPOSAL

class Validation {
  schema: {
    [key: string]: z.Schema
  } = {}

  constructor() {}
}

import * as z from 'zod'

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number().optional(),
})

const userValidator = new Validation({
  schemas: {
    create: UserSchema,
    update: z.partial(UserSchema),
  },
})

userValidator.validateWith('schema.create', { id: '1', name: 'Ag Ag', age: 20 })
```

---

### Storage/Cache Layer API `Stage 0`

```ts

```

---

### Fetch API `Stage 0`

```ts

```

---

### Setup API `Stage 0`

> Root of all API to connect and match everything in one place.

```ts
import orm from 'orm.js'
import {Model} from 'orm.js/model'
import { LocalStorage } from 'orm.js/storage'

import { User, UserSchema, usersFetchers } from './users'
import { Employee, EmployeeSchema, employeeFetchers } from './employee'

const myOrm = orm.setup({
  plugins: [],
  models: {
    users: new User()
    employee: new Employee()
  },
  storage: [LocalStorage],
  validators: {
    users: {
      create: UserSchema,
      update: z.partial(UserSchema)
    },
    employee: {
      create: EmployeeSchema
    }
  },
  fetchers: {
    users: usersFetchers,
    employee: employeeFetchers,
  }
})

myOrm.users.create({}).
```

#### Plugin API

```ts
const sqlite = {
  beforeOperation() {},
  afterOperation() {},
  onOperationExec() {},
  onOperationSuccess() {},
  onOperationFailed() {},
}

orm.setup({
  plugins: [sqlite],
})
```

---

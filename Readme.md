```ts
const authors = new Model('authors')

authors.find() // return all
authors.find().count()
authors.find().indexAt(1).limit(10)
authors.where((author) => author.isActivated).find() // return activated users

authors.create({ id: '1', name: 'Ag Ag', isActivated: true })
authors.createMany([{}, {}])

authors.where((author) => author.id === '1').update({ name: 'ag ag' })

authors.delete((author) => author.id === '2')
authors.purge() // delete all

const books = new Model('books')
books.create({ id: '1', name: 'The Ending of Life', authorId: '1' })
```

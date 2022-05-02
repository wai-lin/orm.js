import { it, expect, beforeEach } from 'vitest'
import { Model } from '~/orm/model'

interface User {
  name: string
  age: number
  sex: 'male' | 'female'
}

let userModel = new Model<User>({
  entity: 'users',
})

const users: User[] = [
  { name: 'Ag Ag', age: 24, sex: 'male' },
  { name: 'Mg Mg', age: 18, sex: 'male' },
  { name: 'Mya Mya', age: 30, sex: 'female' },
]

beforeEach(() => {
  const newInstance = new Model<User>({
    entity: 'users',
  })
  userModel = newInstance.createMany(users)
})

it('should create Model instance.', () => {
  const newModelInstance = new Model<User>({ entity: 'users' })
  expect(newModelInstance._entity).toBe('users')
  expect(newModelInstance.get()).toEqual([])
})

it('should add new user to the in Memory list.', () => {
  const newModelInstance = new Model<User>({ entity: 'users' })
  const newUser: User = { name: 'Ag Ag', age: 24, sex: 'male' }
  expect(newModelInstance.create(newUser).get()).toEqual([newUser])
})

it('should find Ag Ag.', () => {
  const toEqual = [users[0]]
  expect(userModel.find((user) => user.name === 'Ag Ag').get()).toEqual(toEqual)
})

it('should delete Mg Mg', () => {
  const toEqual: User[] = [
    { name: 'Ag Ag', age: 24, sex: 'male' },
    { name: 'Mya Mya', age: 30, sex: 'female' },
  ]
  expect(userModel.delete((user) => user.name === 'Mg Mg').get()).toEqual(
    toEqual,
  )
})

it('should update Ag Ag to Aye Mg', () => {
  expect(userModel.get()).toEqual(users)

  const toEqual: User[] = [
    { name: 'Aye Mg', age: 24, sex: 'male' },
    { name: 'Mg Mg', age: 18, sex: 'male' },
    { name: 'Mya Mya', age: 30, sex: 'female' },
  ]
  expect(
    userModel.update({ name: 'Aye Mg' }, (user) => user.name === 'Ag Ag').get(),
  ).toEqual(toEqual)
})

it('should create Aye Mya', () => {
  const toEqual: User[] = [
    { name: 'Ag Ag', age: 24, sex: 'male' },
    { name: 'Mg Mg', age: 18, sex: 'male' },
    { name: 'Mya Mya', age: 30, sex: 'female' },
    { name: 'Aye Mya', age: 50, sex: 'female' },
  ]
  expect(
    userModel
      .createOrMerge(
        { name: 'Aye Mya', age: 50, sex: 'female' },
        (user) => user.name === 'Aye Mya',
      )
      .get(),
  ).toEqual(toEqual)
})

it('should merge Ag Ag with new age 26', () => {
  const toEqual: User[] = [
    { name: 'Ag Ag', age: 26, sex: 'male' },
    { name: 'Mg Mg', age: 18, sex: 'male' },
    { name: 'Mya Mya', age: 30, sex: 'female' },
  ]
  expect(
    userModel.createOrMerge({ age: 26 }, (user) => user.name === 'Ag Ag').get(),
  ).toEqual(toEqual)
})

it('should join and Populate books with authors.', () => {
  interface Book {
    id: string
    title: string
    authorId: string
  }
  interface Author {
    id: string
    name: string
    books?: Book[]
  }

  const books = new Model<Book>({
    entity: 'books',
    initialData: [
      { id: 'book1', title: 'Book 1', authorId: 'author1' },
      { id: 'book2', title: 'Book 2', authorId: 'author2' },
      { id: 'book3', title: 'Book 3', authorId: 'author1' },
      { id: 'book4', title: 'Book 4', authorId: 'author3' },
    ],
  })

  const authors = new Model<Author>({
    entity: 'authors',
    initialData: [
      { id: 'author1', name: 'Author 1' },
      { id: 'author2', name: 'Author 2' },
      { id: 'author3', name: 'Author 3' },
    ],
  })

  const toEqual: Author[] = [
    {
      id: 'author1',
      name: 'Author 1',
      books: [
        { id: 'book1', title: 'Book 1', authorId: 'author1' },
        { id: 'book3', title: 'Book 3', authorId: 'author1' },
      ],
    },
    {
      id: 'author2',
      name: 'Author 2',
      books: [{ id: 'book2', title: 'Book 2', authorId: 'author2' }],
    },
    {
      id: 'author3',
      name: 'Author 3',
      books: [{ id: 'book4', title: 'Book 4', authorId: 'author3' }],
    },
  ]

  expect(
    authors
      .join(books.get(), {
        populateKey: 'books',
        relation: { id: 'authorId' },
      })
      .get(),
  ).toEqual(toEqual)
})

it('should join and Populate books with authors more than one Foreign Key.', () => {
  interface Book {
    id: string
    title: string
    authorId: string
    authorName: string
  }
  interface Author {
    id: string
    name: string
    books?: Book[]
  }

  const books = new Model<Book>({
    entity: 'books',
    initialData: [
      {
        id: 'book1',
        title: 'Book 1',
        authorId: 'author1',
        authorName: 'Author 1',
      },
      {
        id: 'book2',
        title: 'Book 2',
        authorId: 'author2',
        authorName: 'Author 2',
      },
      {
        id: 'book3',
        title: 'Book 3',
        authorId: 'author1',
        authorName: 'Author 1',
      },
      {
        id: 'book4',
        title: 'Book 4',
        authorId: 'author3',
        authorName: 'Author 2',
      },
    ],
  })

  const authors = new Model<Author>({
    entity: 'authors',
    initialData: [
      { id: 'author1', name: 'Author 1' },
      { id: 'author2', name: 'Author 2' },
      { id: 'author3', name: 'Author 3' },
    ],
  })

  const toEqual: Author[] = [
    {
      id: 'author1',
      name: 'Author 1',
      books: [
        {
          id: 'book1',
          title: 'Book 1',
          authorId: 'author1',
          authorName: 'Author 1',
        },
        {
          id: 'book3',
          title: 'Book 3',
          authorId: 'author1',
          authorName: 'Author 1',
        },
      ],
    },
    {
      id: 'author2',
      name: 'Author 2',
      books: [
        {
          id: 'book2',
          title: 'Book 2',
          authorId: 'author2',
          authorName: 'Author 2',
        },
        {
          id: 'book4',
          title: 'Book 4',
          authorId: 'author3',
          authorName: 'Author 2',
        },
      ],
    },
    {
      id: 'author3',
      name: 'Author 3',
      books: [
        {
          id: 'book4',
          title: 'Book 4',
          authorId: 'author3',
          authorName: 'Author 2',
        },
      ],
    },
  ]

  const result = authors
    .join(books.get(), {
      populateKey: 'books',
      relation: {
        id: 'authorId',
        name: 'authorName',
      },
    })
    .get()

  expect(result).toEqual(toEqual)
})

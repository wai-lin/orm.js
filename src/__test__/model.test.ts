import { it, expect } from 'vitest'
import { Model } from '~/model'

interface User {
  name: string
  age: number
  sex: 'male' | 'female'
}

const userModel = new Model<User>({
  entity: 'users',
})

it('should create Model instance.', () => {
  expect(userModel._entity).toBe('users')
  expect(userModel.get()).toEqual([])
})

it('should add new user to the in Memory list.', () => {
  const newUser: User = { name: 'Ag Ag', age: 24, sex: 'male' }
  const createInstance = userModel.create(newUser)
  expect(createInstance.get()).toEqual([newUser])
})

it('should find Ag Ag.', () => {
  const users: User[] = [
    { name: 'Ag Ag', age: 24, sex: 'male' },
    { name: 'Mg Mg', age: 18, sex: 'male' },
    { name: 'Mya Mya', age: 30, sex: 'female' },
  ]
  const createInstance = userModel.createMany(users)
  const toEqual = [users[0]]
  expect(createInstance.where((user) => user.name === 'Ag Ag').get()).toEqual(
    toEqual,
  )
})

it('should delete Mg Mg', () => {
  const users: User[] = [
    { name: 'Ag Ag', age: 24, sex: 'male' },
    { name: 'Mg Mg', age: 18, sex: 'male' },
    { name: 'Mya Mya', age: 30, sex: 'female' },
  ]
  const createInstance = userModel.createMany(users)
  const toEqual: User[] = [
    { name: 'Ag Ag', age: 24, sex: 'male' },
    { name: 'Mya Mya', age: 30, sex: 'female' },
  ]
  expect(createInstance.delete((user) => user.name === 'Mg Mg').get()).toEqual(
    toEqual,
  )
})

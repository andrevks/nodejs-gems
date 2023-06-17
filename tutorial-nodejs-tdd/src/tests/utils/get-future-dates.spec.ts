import { expect, test } from 'vitest'
import { getFutureDate } from './get-future-date'

test('increases date with one year ', () => {
  const year = new Date().getFullYear()
  const nextYear = year + 1
  expect(getFutureDate(`${year}-06-17`).getFullYear()).toEqual(nextYear)
})

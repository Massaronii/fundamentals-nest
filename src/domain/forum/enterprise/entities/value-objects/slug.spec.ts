import { Slug } from './slug'

test('it should be able to create a new slug from a text', () => {
  const slug = Slug.createFromText('An example title')

  expect(slug.value).toBe('an-example-title')
})

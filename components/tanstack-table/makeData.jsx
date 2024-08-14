import { faker } from "@faker-js/faker";

// Function to generate a single person object with random data
const newPerson = (num) => ({
  id: num,
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  age: faker.number.int({ max: 40 }),
  visits: faker.number.int({ max: 1000 }),
  progress: faker.number.int({ max: 100 }),
  status: faker.helpers.shuffle(["relationship", "complicated", "single"])[0],
});

// Generate a flat list of 1000 people
const makeData = (count = 1000) =>
  Array.from({ length: count }, (_, index) => newPerson(index));

// Export the function
export default makeData;

exports.seed = function (knex) {
  return knex('Users').insert([
    {
      //id: 1,
      email: 'LambdaLabsPT9NeighborhoodChef+SwedishChef@gmail.com',
      firstName: 'Swedish',
      lastName: 'Chef',
      gender: 'male',
      address: 'Sweden',
      latitude: 60.8934744,
      longitude: -0.2821392,
      photo: 'https://upload.wikimedia.org/wikipedia/en/e/e7/The_Swedish_Chef.jpg',
    },
    {
      //id: 2,
      email: 'LambdaLabsPT9NeighborhoodChef+GordonRamsay@gmail.com',
      firstName: 'Gordon',
      lastName: 'Ramsay',
      gender: 'male',
      address: 'South London, UK',
      latitude: 51.4012818,
      longitude: -0.1936287,
    },
  ]);
};

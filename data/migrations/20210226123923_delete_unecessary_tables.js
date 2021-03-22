exports.up = function (knex) {
  return knex.schema
    .dropTableIfExists('Attendee_Ingredients')
    .dropTableIfExists('Event_Ingredients')
    .dropTableIfExists('Events_Recipes')
    .dropTableIfExists('Recipe_Ingredients')
    .dropTableIfExists('Ingredients')
    .dropTableIfExists('IngredientTypes')
    .dropTableIfExists('UnitsOfMeasure')
    .dropTableIfExists('MeasurementTypes')
    .dropTableIfExists('Recipes');
};

exports.down = function (knex) {
  return knex.schema;
};

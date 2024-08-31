import DaggerheartDataModel from "./base-model.mjs";

export default class DaggerheartActorBase extends DaggerheartDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    schema.hitpoints = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 6 }),
    });
    schema.stress = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 6 }),
    });
    schema.armor = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 6 }),
    });
    schema.hope = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 2, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 6 }),
    });
    schema.biography = new fields.StringField({ required: true, blank: true }); // equivalent to passing ({initial: ""}) for StringFields

    return schema;
  }
}

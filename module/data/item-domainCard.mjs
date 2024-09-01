import DaggerheartItemBase from "./base-item.mjs";

export default class DaggerheartDomainCard extends DaggerheartItemBase {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = {};

    schema.domainName = new fields.SchemaField({
      value: new fields.StringField({
        required: true,
        nullable: false,
        blank: true,
        choices: [
          "Arcana",
          "Blade",
          "Bone",
          "Codex",
          "Grace",
          "Midnight",
          "Sage",
          "Splendor",
          "Valor",
          ""
        ],
      })
    });
    schema.cardType = new fields.SchemaField({
      value: new fields.StringField({
        required: true,
        nullable: false,
        blank: true,
        choices: [
          "Ability",
          "Spell",
          "Grimoire",
          ""
        ]
      })
    });
    schema.cardLevel = new fields.SchemaField({
      value: new fields.NumberField({
        required: true,
        nullable: false,
        integer: true,
        initial: 1,
        min: 1,
        max: 10
      })
    });

    return schema;
  }
}

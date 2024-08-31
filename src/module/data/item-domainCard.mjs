import DaggerheartItemBase from "./base-item.mjs";

export default class DaggerheartDomainCard extends DaggerheartItemBase {

    static defineSchema() {
        const fields = foundry.data.fields;
        const schema = super.defineSchema();

        schema.domainName = new fields.StringField({ required: true, nullable: false, blank: false, choices: ["Arcana", "Blade", "Bone", "Codex", "Grace", "Midnight", "Sage", "Splendor", "Valor"] });
        schema.cardLevel = new fields.NumberField({ required: true, nullable: fakse, integer: true, initial: 1, min: 1, max: 10 })

        return schema;
    }
}

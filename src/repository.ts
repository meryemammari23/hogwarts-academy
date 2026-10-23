import type { Wizard, NewWizard, Spell } from "./types";
import { Log, MeasureTime, ValidateSpellPower } from "./decorators";

export class Repository<T extends { id: number }> {
  private items: T[] = [];

  @Log
  add(item: T): void {
    this.items.push(item);
  }

  @MeasureTime
  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  update(id: number, changes: Partial<T>): boolean {
    const item = this.findById(id);

    if (!item) return false;

    Object.assign(item, changes);
    return true;
  }
}

export class WizardRepository extends Repository<Wizard> {
  // Ex.1 — le référentiel attribue l'identifiant.
  create(data: NewWizard): Wizard {
    const nextId = this.getAll().reduce((max, w) => Math.max(max, w.id), 0) + 1;
    const wizard: Wizard = { ...data, id: nextId };
    this.add(wizard);
    return wizard;
  }

  // Ex.2 — Wizard["house"] = type à accès indexé (équivaut à House).
  findByHouse(house: Wizard["house"]): Wizard[] {
    return this.getAll().filter(wizard => wizard.house === house);
  }
}

export class SpellRepository extends Repository<Spell> {
  // Ex.4 — rejette un sort de puissance négative.
  @ValidateSpellPower
  override add(spell: Spell): void {
    super.add(spell);
  }
}

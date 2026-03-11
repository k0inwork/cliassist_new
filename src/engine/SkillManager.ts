import { Skill, TensorPosition, CommandEvent, World } from '../common/types';

export class SkillManager {
  private BASE_XP = 10;

  calculateXpGain(event: CommandEvent, tensor: TensorPosition, world: World): number {
    const effortMult = 1 + (event.duration / 5);
    const worldBonus = world.commonTensors[tensor.id] || 1.0;

    return this.BASE_XP * effortMult * worldBonus;
  }

  updateSkill(skill: Skill, xpGain: number): Skill {
    const newXp = skill.xp + xpGain;
    let mastery = skill.mastery;

    if (newXp >= 250) mastery = 'master';
    else if (newXp >= 100) mastery = 'advanced';
    else if (newXp >= 50) mastery = 'basic';

    return {
      ...skill,
      xp: newXp,
      mastery,
      lastUsed: Date.now()
    };
  }

  createNewSkill(tensor: TensorPosition, world: World): Skill {
    return {
      id: `skill_${tensor.id}`,
      tensorPattern: tensor.id,
      xp: 0,
      mastery: 'none',
      name: `New Skill (${tensor.id})`, // Would be named by LLM later
      description: `Experience with ${tensor.id} in ${world.id}`,
      world: world.id,
      lastUsed: Date.now()
    };
  }
}

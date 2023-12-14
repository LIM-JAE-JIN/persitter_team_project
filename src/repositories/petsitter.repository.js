export class PetsitterRepository {
  constructor(prisma) {
    this.prisma = prisma
  }

  getSitters = async () => {
    const data = this.prisma.PetSitters.findMany();

    return data;
  }
}
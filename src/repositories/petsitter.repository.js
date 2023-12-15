export class PetsitterRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  getSitters = async () => {
    const data = this.prisma.PetSitters.findMany();

    return data;
  };

  getSitterById = async (sitterId) => {
    const data = this.prisma.PetSitters.findUnique({
      where: { sitterId: +sitterId },
    });

    return data;
  };
}

export class PetsitterService {
  constructor(petsitterRepository) {
    this.petsitterRepository = petsitterRepository;
  }

  getSitters = async () => {
    const data = await this.petsitterRepository.getSitters();

    return data.map((sitter) => {
      return {
        sitterId: sitter.sitterId,
        name: sitter.name,
        introduce: sitter.introduce,
        phone: sitter.phone,
        imgUrl: sitter.imgUrl,
        address: sitter.address,
        career: sitter.career,
        createdAt: sitter.createdAt,
        updatedAt: sitter.updatedAt,
      };
    });
  };
  getSitterById = async (sitterId) => {
    const data = await this.petsitterRepository.getSitterById(sitterId);

    return data;
  };
}

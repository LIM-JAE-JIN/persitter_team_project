export class PetsitterService {
  constructor(petsitterRefository) {
    this.petsitterRefository = petsitterRefository;
  }

  getSitters = async () => {
    const data = await this.petsitterRefository.getSitters();

    return data.map((sitter) => {
      return {
        sittetId: sitter.sittetId,
        name: sitter.name,
        introduce: sitter.introduce,
        phone: sitter.phone,
        address: sitter.address,
        career: sitter.career,
        createdAt: sitter.createdAt,
        updatedAt: sitter.updatedAt
      }
    })
  }
}
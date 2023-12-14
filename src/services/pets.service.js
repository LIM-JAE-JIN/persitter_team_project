import { CustomError } from "../middlewares/error.middleware.js";
import { PetsRepository } from "../repositories/pets.repository.js"


export class PetsService {
    petsRepository = new PetsRepository();

    // 펫 생성
    createPet = async (userId, petName, petAge, imgUrl, petCategory) => {
        try {
            const createdPet = await this.petsRepository.createOne(
                userId,
                petName,
                petAge,
                imgUrl,
                petCategory,
            );

            return {
                userId: createdPet.uerId,
                petName: createdPet.petName,
                petAge: createdPet.petAge,
                imgUrl: createdPet.imgUrl,
                petCategory: createdPet.petCategory,
            };
        } catch (error) {
            console.log(error);
            next(error);
        }
    }




    // 펫 조회
    getMyPets = async () => {
        const pets = await this.petsRepository.getMyPets();

        pets.sort((a, b) => {
            return b.createdAt - a.createdAt
        })

        return pets.map((pet) => {
            return {
                petName: pet.petName,
                petAge: pet.petAge,
                petCategory: pet.petCategory,
                createdAt: pet.createdAt,
                updatedAt: pet.updatedAt,
            };
        });
    }


    // 펫 수정
    updatePet = async (petId, petName, petAge, imgUrl, petCategory) => {
        const pet = await this.petsRepository.findPetById(petId);

        if (!pet) throw new CustomError('펫이 존재하지 않습니다.', 404);

        await this.petsRepository.updatePet(petId, petName, petAge, imgUrl, petCategory);

        const updatedpet = await this.petsRepository.findPetById(petId);

        return {
            petId: updatedpet.petId,
            petName: updatedpet.petName,
            petAge: updatedpet.petAge,
            imgUrl: updatedpet.imgUrl,
            petCategory: updatedpet.petCategory,
        };
    };


    // 펫 삭제
    deletePet = async (petId) => {
        const pet = await this.petsRepository.findPetById(petId);

        if(!pet) throw new CustomError ('펫이 존재하지 않습니다.', 404);

        await this.petsRepository.deletePet(petId);

        return {
            petId: pet.petId,
            petName: pet.petName,
            petAge: pet.petAge,
            imgUrl: pet.imgUrl,
            petCategory: pet.petCategory,
        }
    }

}
import { prisma } from '../utils/prisma/index.js';

export class PetsRepository {

    // 펫 생성
    createOne = async (userId, petName, petAge, imgUrl, petCategory) => {
        try {
            const createdPet = await prisma.Pets.create({
                data: {
                    userId,
                    petName,
                    petAge,
                    imgUrl,
                    petCategory,
                },
            });

            return createdPet;

        } catch (error) {
            console.log(error);
            next(error);
        }
    }


    // 펫 조회
    getMyPets = async () => {
        const pets = await prisma.Pets.findMany();

        return pets;
    }


    // 유저의 펫 조회
    getUserPets = async (userId) => {
        const userPets = await prisma.Users.findUnique({
            where: {
                userId: +userId,
            },
            include: {
                Pets: true,
            },
        });

        return userPets?.Pets || [];
    }


    findPetById = async (petId) => {
        const pet = await prisma.Pets.findUnique({
            where: { petId: +petId },
        });
        return pet;
    }

    // 펫 수정
    updatePet = async (petId, petName, petAge, imgUrl, petCategory) => {
        const pet = await prisma.Pets.update({
            where: {
                petId: +petId
            },
            data: {
                petName,
                petAge,
                imgUrl,
                petCategory,
            }
        });
        return pet;
    }


    // 펫 삭제
    deletePet = async (petId) => {
        const pet = await prisma.Pets.delete(
            {
                where: { petId: +petId },
            });

        return pet;
    }
}
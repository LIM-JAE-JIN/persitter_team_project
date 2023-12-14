import { PetsService } from "../services/pets.service.js";
import { CustomError } from "../middlewares/error.middleware.js";
export class PetsController {
    petsService = new PetsService();

    // 펫 생성
    createPet = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { petName, petAge, imgUrl, petCategory } = req.body;
            console.log("유저확인 ", userId)
            const createdPet = await this.petsService.createPet(
                userId,
                petName,
                petAge,
                imgUrl,
                petCategory,
            );
            res.status(200).json({
                success: true,
                message: "성공적으로 생성되었습니다.",
                data: {
                    userId: createdPet.userId,
                    petName: createdPet.petName,
                    petAge: createdPet.petAge,
                    imgUrl: createdPet.imgUrl,
                    petCategory: createdPet.petCategory,
                }
            });
        } catch (error) {
            console.log("에러 : ", error);
            next(error);
        }
    }


    // 펫 조회
    getMyPets = async (req, res, next) => {
        try {
            const getPets = await this.petsService.getMyPets();

            return res.status(200).json({
                message: "성공적으로 조회 되었습니다.",
                data: getPets
            });

        } catch (error) {
            console.log("에러 : ", error);
            // return res.status(500).json({ message: "에러 발생" });
            next(error);
        }
    }


    // 펫 수정
    updatePet = async (req, res, next) => {
        try {
            const { petId } = req.params;
            const { petName, petAge, imgUrl, petCategory } = req.body;


            if (!petId) throw new CustomError('존재하지 않는 펫입니다.', 404);
        
            const updatedPet = await this.petsService.updatePet(
                petId, petName, petAge, imgUrl, petCategory
            )

            res.status(200).json({
                success: true,
                message: "성공적으로 수정 되었습니다.",
                data: updatedPet,
            });

        } catch (error) {
            console.log("에러 : ", error);
            // return res.status(500).json({ message: "에러 발생" });
            next(error);
        }

    }



    // 펫 삭제
    deletePet = async (req, res, next) => {
        try {
            const { petId } = req.params;

            if (!petId) throw new CustomError('존재하지 않는 펫입니다.',404);

            const deletedPet = await this.petsService.deletePet(petId);

            res.status(200).json({
                success: true,
                message: "성공적으로 삭제 되었습니다.",
                data: deletedPet,
            });

        } catch (error) {
            console.log("에러 : ", error);
            // return res.status(500).json({ message: "에러 발생" });
            next(error);
        }
    }
}
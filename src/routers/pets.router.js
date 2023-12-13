import { Router } from 'express';
import auth from '../middlewares/need-signin.middleware.js';
import {prisma} from '../utils/prisma/index.js';
const petsRouter = Router();

// 펫 생성
petsRouter.post('/', auth ,async (req, res) => {
    const {userId} = req.user;
    console.log(userId);
    const { petName, petAge, imgUrl, petCategory } = req.body;
    try {
        const createdPet = await prisma.pets.create({
            data: {
                UserId: +userId,
                petName,
                petAge,
                imgUrl,
                petCategory,
            },
        });
        res.status(200).json({
            success: true,
            message: "성공적으로 생성되었습니다.",
            data: createdPet
        });
    } catch (error) {
        console.log("에러 : ", error);
        return res.status(500).json({ error: "에러 발생" });
    }
});

// 펫 조회
petsRouter.get('/', async (req, res) => {
    try {
        const getPets = await prisma.pets.findMany({
            select: {
                petName: true,
                petAge: true,
                petCategory: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json({
            message: "성공적으로 조회 되었습니다.",
            data: getPets
        });

    } catch (error) {
        console.log("에러 : ", error);
        return res.status(500).json({ message: "에러 발생" });
    }
});


// 펫 수정
petsRouter.put('/:petId', async (req, res) => {
    const { petId } = req.params;
    const { petName, petAge, imgUrl, petCategory } = req.body;

    try {
        if (!petId) {
            return res.status(404).json({ message: "존재하지 않는 펫입니다." });
        }
        const updatedPet = await prisma.pets.update({
            where: { petId: +petId },
            data: {
                petName,
                petAge,
                imgUrl,
                petCategory,
            },
        });

        res.status(200).json({
            success: true,
            message: "성공적으로 수정 되었습니다.",
            data: updatedPet,
        });

    } catch (error) {
        console.log("에러 : ", error);
        return res.status(500).json({ message: "에러 발생" });
    }

});


// 펫 삭제
petsRouter.delete('/:petId', async (req, res) => {
    const { petId } = req.params;

    try {
        const existPet = await prisma.pets.findUnique({
            where: { petId: +petId }
        });

        if (!existPet) {
            return res.status(404).json({ message: "존재하지 않는 펫입니다." });
        }

        await prisma.pets.delete({
            where: { petId: +petId },
        });

        res.status(200).json({
            success: true,
            message: "성공적으로 삭제 되었습니다.",
        });

    } catch (error) {
        console.log("에러 : ", error);
        return res.status(500).json({ message: "에러 발생" });
    }
});

export {petsRouter};
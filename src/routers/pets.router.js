import { Router } from 'express';
import auth from '../middlewares/need-signin.middleware.js';
import { PetsController } from '../controllers/pets.controller.js';

const petsController = new PetsController();

const petsRouter = Router();

// 펫 생성
petsRouter.post('/', auth, petsController.createPet);

// 펫 조회
petsRouter.get('/', petsController.getMyPets);


// 펫 수정 
petsRouter.put('/:petId', petsController.updatePet);


// 펫 삭제 
petsRouter.delete('/:petId', petsController.deletePet);

export { petsRouter };
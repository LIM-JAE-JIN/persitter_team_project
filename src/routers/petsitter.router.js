import { Router } from 'express';
import { PetsitterController } from '../controllers/petsitter.controller.js';
import { PetsitterService } from '../services/petsitter.service.js';
import { PetsitterRepository } from '../repositories/petsitter.repository.js';
import { prisma } from '../utils/prisma/index.js'


const petsitterRepository = new PetsitterRepository(prisma);
const petsitterService = new PetsitterService(petsitterRepository);
const petsitterController = new PetsitterController(petsitterService);

const petsitterRouter = Router();

// 펫시터 조회
petsitterRouter.get('/', petsitterController.getSitters);


export { petsitterRouter };
import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';

const router = Router();


const noteIdSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().hex().length(24).required(),
  }),
});

const createNoteSchema = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    content: Joi.string().min(1).required(),
  }),
});

const updateNoteSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().hex().length(24).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(100),
    content: Joi.string().min(1),
  }),
});


router.get('/notes', getAllNotes);

router.get('/notes/:noteId', noteIdSchema, getNoteById);

router.post('/notes', createNoteSchema, createNote);

router.delete('/notes/:noteId', noteIdSchema, deleteNote);

router.patch('/notes/:noteId', updateNoteSchema, updateNote);

export default router;

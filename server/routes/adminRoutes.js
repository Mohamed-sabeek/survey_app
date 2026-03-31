const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getAllResponses,
  updateResponse,
  deleteResponse,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/responses', protect, getAllResponses);
router.put('/responses/:id', protect, updateResponse);
router.delete('/responses/:id', protect, deleteResponse);

module.exports = router;

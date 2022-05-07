const express = require('express')
const router = express.Router()

const orderController = require('../../controllers/order.controller')

router.post('/', orderController.create)
router.post('/search', orderController.search)

router.put('/:id', orderController.update)
router.get('/list', orderController.allOrders)
router.get('/list/:status', orderController.orderListByStatus)
router.get('/myorders', orderController.viewuserorder)
router.get('/myorder/:id', orderController.viewAOwnOrder)
router.get('/view/:id', orderController.viewOrder)
router.get('/count', orderController.count)
router.put('/delete/:id', orderController.delete)
module.exports = router

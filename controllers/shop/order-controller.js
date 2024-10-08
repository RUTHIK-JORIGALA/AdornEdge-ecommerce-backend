const Order = require("../../models/Order")


const createOrder = async(req, res) => {
    try {
        const {
            userId,
            cartItem,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId,
            cartId
        } = req.body;

        const newlyCreatedOrder = new Order({
            userId,
            cartItem,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId,
            cartId
        })

        await newlyCreatedOrder.save();

        res.status(201).json({
            success: true,
            orderId: newlyCreatedOrder._id
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error creating order"
        })
    }
}

// TODO
// CapturePayment

const getAllOrdersByUser = async(req, res) =>{
    try {
        const {userId} = req.params;

        const orders = await Order.find({userId});

        if(!orders.length){
            return res.status(404).json({
                success: false,
                message: "No orders found"
            })
        }

        res.status(200).json({
            success: true,
            data: orders
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching orders"
        })
    }
}

const getOrderDetails = async(req, res) => {
    try {
        const {id} = req.params;

        const order = await Order.findById(id);

        if(!order){
            return res.status(404).json({
                success: false,
                message: "Order not found!"
            })
        }

        res.status(200).json({
            success: false,
            message: "Some error occured"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching orderDetails"
        })
    }
}

module.exports = {
    createOrder,
    getAllOrdersByUser,
    getOrderDetails
}


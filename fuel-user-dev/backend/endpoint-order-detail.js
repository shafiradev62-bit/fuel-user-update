// Tambahkan endpoint ini ke backend/server/index-standardized.js

app.get('/api/orders/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    // Get order with related data
    const order = await db.select({
      id: orders.id,
      trackingNumber: orders.trackingNumber,
      customerId: orders.customerId,
      stationId: orders.stationId,
      fuelFriendId: orders.fuelFriendId,
      vehicleId: orders.vehicleId,
      deliveryAddress: orders.deliveryAddress,
      deliveryPhone: orders.deliveryPhone,
      fuelType: orders.fuelType,
      fuelQuantity: orders.fuelQuantity,
      fuelCost: orders.fuelCost,
      deliveryFee: orders.deliveryFee,
      groceriesCost: orders.groceriesCost,
      totalAmount: orders.totalAmount,
      orderType: orders.orderType,
      scheduledDate: orders.scheduledDate,
      scheduledTime: orders.scheduledTime,
      estimatedDeliveryTime: orders.estimatedDeliveryTime,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      paymentMethod: orders.paymentMethod,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      // Station info
      stationName: fuelStations.name,
      stationAddress: fuelStations.address,
      // Fuel friend info
      fuelFriendName: fuelFriends.fullName,
      fuelFriendPhone: fuelFriends.phoneNumber,
      fuelFriendLocation: fuelFriends.location,
      fuelFriendPhoto: fuelFriends.profilePhoto,
      // Vehicle info
      vehicleBrand: vehicles.brand,
      vehicleColor: vehicles.color,
      vehicleLicense: vehicles.licenseNumber
    })
    .from(orders)
    .leftJoin(fuelStations, eq(orders.stationId, fuelStations.id))
    .leftJoin(fuelFriends, eq(orders.fuelFriendId, fuelFriends.id))
    .leftJoin(vehicles, eq(orders.vehicleId, vehicles.id))
    .where(sql`${orders.id} = ${id} AND ${orders.customerId} = ${userId}`)
    .limit(1);
    
    if (!order.length) {
      return res.error(RESPONSE_CODES.ORDER_NOT_FOUND);
    }
    
    // Get order items
    const items = await db.select({
      id: orderItems.id,
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      price: orderItems.price,
      productName: products.name,
      productImage: products.image
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, id));
    
    return res.success(RESPONSE_CODES.SUCCESS, {
      ...order[0],
      items: items
    });
  } catch (error) {
    console.error('Order detail error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});